import { Injectable } from '@nestjs/common';
import {
    ID,
    Order,
    OrderService,
    RequestContext,
    TransactionalConnection,
    CustomFieldRelationService,
} from '@vendure/core';
import { Schedule } from '../entities/schedule.entity';
import { PluginInitOptions } from '../types';


@Injectable()
export class ScheduleService {
  private scheduleOptions: PluginInitOptions;

  constructor(
    private connection: TransactionalConnection,
    private orderService: OrderService,
    private customFieldRelationService:CustomFieldRelationService,
  ) {}

  init(options:PluginInitOptions) {
    this.scheduleOptions = {
      minRescheduleDays: options.minRescheduleDays || 1,
      maxRescheduleFrequency: options.maxRescheduleFrequency || 3,
      rescheduleWindowDays: options.rescheduleWindowDays || 30,
    };
  }

  async createOrUpdateSchedule(
    ctx: RequestContext,
    orderId: string,
    startDate: Date,
    endDate: Date,
    startTime: string,
    endTime: string
  ): Promise<Schedule> {
    const existingSchedule = await this.connection.getRepository(ctx, Schedule).findOne({
      where: { order: { id: orderId } },
      relations:{order:true},
    });

    if (existingSchedule) {
      return this.updateSchedule(ctx, existingSchedule, startDate, endDate, startTime, endTime);
    } else {
      return this.createSchedule(ctx, orderId, startDate, endDate, startTime, endTime);
    }
  }

  private async createSchedule(
    ctx: RequestContext,
    orderId: string,
    startDate: Date,
    endDate: Date,
    startTime: string,
    endTime: string
  ): Promise<Schedule> {
    const schedule = new Schedule();
    schedule.order = { id: orderId } as any;
    schedule.originalStartDate = startDate;
    schedule.originalEndDate = endDate;
    schedule.originalStartTime = startTime;
    schedule.originalEndTime = endTime;
    schedule.currentStartDate = startDate;
    schedule.currentEndDate = endDate;
    schedule.currentStartTime = startTime;
    schedule.currentEndTime = endTime;
    
    const savedSchedule = await this.connection.getRepository(ctx, Schedule).save(schedule);
    await this.updateOrderQuantities(ctx, orderId, this.calculateDurationInWeeks(startDate, endDate));
    await this.orderService.updateCustomFields(ctx,orderId,{"Schedule":savedSchedule});
    return savedSchedule;
  }

  private async updateSchedule(
    ctx: RequestContext,
    existingSchedule: Schedule,
    startDate: Date,
    endDate: Date,
    startTime: string,
    endTime: string
  ): Promise<Schedule> {
    existingSchedule.currentStartDate = startDate;
    existingSchedule.currentEndDate = endDate;
    existingSchedule.currentStartTime = startTime;
    existingSchedule.currentEndTime = endTime;

    const savedSchedule = await this.connection.getRepository(ctx, Schedule).save(existingSchedule);
    await this.updateOrderQuantities(ctx, existingSchedule.order.id, this.calculateDurationInWeeks(startDate, endDate));
    await this.orderService.updateCustomFields(ctx,existingSchedule.order.id,{"Schedule":savedSchedule});
    return savedSchedule;
  }

  async reschedule(
    ctx: RequestContext,
    orderId: string,
    newStartDate: Date,
    newEndDate: Date,
    newStartTime: string,
    newEndTime: string
  ): Promise<Schedule> {
    const schedule = await this.connection.getRepository(ctx, Schedule).findOne({
      where: { order: { id: orderId } },
    });
    if (!schedule) {
      throw new Error('Schedule not found');
    }

    const order = await this.orderService.findOne(ctx, orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    // Check rescheduling rules
    this.checkRescheduleRules(schedule, newStartDate);

    // Preserve the original duration
    const originalDurationInWeeks = this.calculateDurationInWeeks(schedule.currentStartDate, schedule.currentEndDate);
    const newDurationInWeeks = this.calculateDurationInWeeks(newStartDate, newEndDate);

    if (newDurationInWeeks !== originalDurationInWeeks) {
      throw new Error('New schedule duration must match the original duration');
    }

    // Update the current schedule
    schedule.currentStartDate = newStartDate;
    schedule.currentEndDate = newEndDate;
    schedule.currentStartTime = newStartTime;
    schedule.currentEndTime = newEndTime;
    schedule.lastRescheduledDate = new Date();

    const savedSchedule = await this.connection.getRepository(ctx, Schedule).save(schedule);

    // If the order is not paid, update the quantities
    if (order.state !== 'PaymentSettled') {
      await this.updateOrderQuantities(ctx, orderId, newDurationInWeeks);
    }

    return savedSchedule;
  }

  private checkRescheduleRules(schedule: Schedule, newStartDate: Date): void {
    const now = new Date();
    const daysDifference = Math.ceil((newStartDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    // Check minimum days before rescheduling
    if (daysDifference < this.scheduleOptions.minRescheduleDays) {
      throw new Error(`Rescheduling must be done at least ${this.scheduleOptions.minRescheduleDays} days in advance`);
    }

    // Check rescheduling window
    if (daysDifference > this.scheduleOptions.rescheduleWindowDays) {
      throw new Error(`Rescheduling can only be done within ${this.scheduleOptions.rescheduleWindowDays} days of the current date`);
    }

    // Check rescheduling frequency
    const rescheduleCount = schedule.rescheduleFrequency; // Simplified for this example
    if (rescheduleCount >= this.scheduleOptions.maxRescheduleFrequency) {
      throw new Error(`You can only reschedule up to ${this.scheduleOptions.maxRescheduleFrequency} times`);
    }
  }

  private calculateDurationInWeeks(startDate: Date, endDate: Date): number {
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.ceil(diffDays / 7);
  }

  private async updateOrderQuantities(ctx: RequestContext, orderId: ID, durationInWeeks: number): Promise<void> {
    const order = await this.orderService.findOne(ctx, orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    for (const line of order.lines) {
      await this.orderService.adjustOrderLine(ctx, orderId, line.id, durationInWeeks );
    }
  }

  async canReschedule(ctx: RequestContext, orderId: string): Promise<boolean> {
    const order = await this.orderService.findOne(ctx, orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    // Check if the order is in a state that allows rescheduling
    const allowedStates = ['Created', 'AddingItems', 'ArrangingPayment', 'PaymentAuthorized', 'PaymentSettled'];
    return allowedStates.includes(order.state);
  }

}
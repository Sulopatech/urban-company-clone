import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Permission } from '@vendure/common/lib/generated-types';
import { ID } from '@vendure/common/lib/shared-types';
import { Allow, Ctx, RequestContext, Transaction } from '@vendure/core';
import { ScheduleService } from '../services/schedule.service';


@Resolver()
export class ScheduleResolver {
  constructor(private scheduleService: ScheduleService) {}

  @Mutation()
  async createOrUpdateOrderSchedule(
    @Ctx() ctx: RequestContext,
    @Args() args: { 
      orderId: string; 
      startDate: Date; 
      endDate: Date;
      startTime: string;
      endTime: string;
    }
  ) {
    return this.scheduleService.createOrUpdateSchedule(
      ctx,
      args.orderId, 
      args.startDate, 
      args.endDate, 
      args.startTime, 
      args.endTime
    );
  }

  @Mutation()
  async rescheduleOrder(
    @Ctx() ctx: RequestContext,
    @Args() args: { 
      orderId: string; 
      newStartDate: Date;
      newEndDate: Date;
      newStartTime: string;
      newEndTime: string;
    }
  ) {
    const canReschedule = await this.scheduleService.canReschedule(ctx, args.orderId);
    if (!canReschedule) {
      throw new Error('This order cannot be rescheduled');
    }
    return this.scheduleService.reschedule(
      ctx,
      args.orderId, 
      args.newStartDate, 
      args.newEndDate, 
      args.newStartTime, 
      args.newEndTime
    );
  }
}

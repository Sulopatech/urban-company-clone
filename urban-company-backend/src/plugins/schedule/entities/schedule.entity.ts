import {
    DeepPartial,
    HasCustomFields,
    LocaleString,
    Translatable,
    Translation,
    VendureEntity,
    Order
} from '@vendure/core';
import { Column, Entity, OneToMany,OneToOne, JoinColumn } from 'typeorm';

// import { ScaffoldTranslation } from './entity-translation.template';

export class ScheduleCustomFields {}


@Entity()
export class Schedule extends VendureEntity implements HasCustomFields {
    constructor(input?: DeepPartial<Schedule>) {
        super(input);
    }

    @OneToOne(type => Order, order => order.id)
    @JoinColumn()
    order: Order;
  
    @Column()
    originalStartDate: Date;
  
    @Column()
    originalEndDate: Date;
  
    @Column()
    originalStartTime: string; // Store as HH:mm
  
    @Column()
    originalEndTime: string; // Store as HH:mm
  
    @Column()
    currentStartDate: Date;
  
    @Column()
    currentEndDate: Date;
  
    @Column()
    currentStartTime: string; // Store as HH:mm
  
    @Column()
    currentEndTime: string; // Store as HH:mm
  
    @Column({ nullable: true })
    lastRescheduledDate: Date;

    @Column({nullable:true})
    rescheduleFrequency:number;

    @Column(type => ScheduleCustomFields)
    customFields: ScheduleCustomFields;
}

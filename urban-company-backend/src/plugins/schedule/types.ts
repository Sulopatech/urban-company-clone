/**
 * @description
 * The plugin can be configured using the following options:
 */
export interface PluginInitOptions {
    minRescheduleDays: number;
    maxRescheduleFrequency: number;
    rescheduleWindowDays: number;
}

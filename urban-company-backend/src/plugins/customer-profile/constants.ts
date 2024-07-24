// src/plugins/customer-profile-pic/constants.ts

import { PermissionDefinition } from '@vendure/core';

export const CUSTOMER_PROFILE_PIC_PERMISSION = new PermissionDefinition({
    name: 'SetCustomerProfilePic',
    description: 'Allows setting a customer profile picture',
});
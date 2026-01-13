export interface SystemSetting {
  id: string;
  key: string;
  value: string;
  valueType: "INTEGER" | "BOOLEAN" | "STRING" | "DECIMAL";
  description: string;
  category: string;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export const mockSystemSettings: SystemSetting[] = [
  {
    id: "1c271d3c-7459-4266-bdcd-f087d1f2a7bf",
    key: "booking.cancellation_window_hours",
    value: "24",
    valueType: "INTEGER",
    description: "Hours before departure within which cancellation fees apply",
    category: "Booking",
    updatedBy: null,
    createdAt: "2026-01-03T23:45:57.828083",
    updatedAt: "2026-01-03T23:45:57.828083"
  },
  {
    id: "c357a9d6-d0f4-4067-adbd-e55041ab77a1",
    key: "booking.max_seats_per_booking",
    value: "4",
    valueType: "INTEGER",
    description: "Maximum number of seats allowed per booking",
    category: "Booking",
    updatedBy: null,
    createdAt: "2026-01-03T23:45:57.828083",
    updatedAt: "2026-01-03T23:45:57.828083"
  },
  {
    id: "3542c830-092d-4dc4-b42e-f18fe05f1455",
    key: "chat.archive_delay_hours",
    value: "24",
    valueType: "INTEGER",
    description: "Hours after ride completion before auto-archiving conversation",
    category: "Chat",
    updatedBy: null,
    createdAt: "2026-01-06T02:30:44.544783",
    updatedAt: "2026-01-06T02:30:44.544783"
  },
  {
    id: "9cdcfb84-cb52-4e98-abd5-a1e4d1a147e1",
    key: "chat.message_retention_days",
    value: "30",
    valueType: "INTEGER",
    description: "Number of days to retain chat messages after ride completion",
    category: "Chat",
    updatedBy: null,
    createdAt: "2026-01-06T02:30:44.544783",
    updatedAt: "2026-01-06T02:30:44.544783"
  },
  {
    id: "1dfc96e8-6aad-402f-843c-38a5cbcfcb88",
    key: "chat.rate_limit.messages_per_minute",
    value: "10",
    valueType: "INTEGER",
    description: "Maximum messages a user can send per minute per conversation",
    category: "Chat",
    updatedBy: null,
    createdAt: "2026-01-06T02:30:44.544783",
    updatedAt: "2026-01-06T02:30:44.544783"
  },
  {
    id: "09d9b0c4-b99b-4282-ba6d-2ccab6ad0039",
    key: "checkin.id_verification_enabled",
    value: "true",
    valueType: "BOOLEAN",
    description: "Whether ID verification is required for passenger check-in",
    category: "Check-in",
    updatedBy: null,
    createdAt: "2026-01-03T23:45:57.828083",
    updatedAt: "2026-01-03T23:45:57.828083"
  },
  {
    id: "e2909320-43f3-45bf-84ee-1e0d05bbcfd7",
    key: "checkin.late_grace_minutes",
    value: "5",
    valueType: "INTEGER",
    description: "Grace period in minutes after departure before check-in is considered late",
    category: "Check-in",
    updatedBy: null,
    createdAt: "2026-01-04T02:04:05.376017",
    updatedAt: "2026-01-04T02:04:05.376017"
  },
  {
    id: "fa84deec-c400-4ad3-8749-dcaca8f4a0b0",
    key: "checkin.late_penalty_per_5min",
    value: "2",
    valueType: "INTEGER",
    description: "Compliance penalty points per 5 minutes of lateness",
    category: "Check-in",
    updatedBy: null,
    createdAt: "2026-01-04T02:04:05.376017",
    updatedAt: "2026-01-04T02:04:05.376017"
  },
  {
    id: "aed8dc57-1850-4360-abb0-62217b8e92a8",
    key: "checkin.max_no_id_attempts",
    value: "3",
    valueType: "INTEGER",
    description: "Maximum times a passenger can check in without ID before being blocked",
    category: "Check-in",
    updatedBy: null,
    createdAt: "2026-01-03T23:45:57.828083",
    updatedAt: "2026-01-03T23:45:57.828083"
  },
  {
    id: "687d6335-402c-4d6c-95f3-b623b578f0ab",
    key: "driver.late_penalty_points",
    value: "5",
    valueType: "INTEGER",
    description: "Credibility points deducted per late arrival",
    category: "Driver",
    updatedBy: null,
    createdAt: "2026-01-03T23:45:57.828083",
    updatedAt: "2026-01-03T23:45:57.828083"
  },
  {
    id: "65fb13f1-8f25-4aae-929f-0a3ebbecce51",
    key: "driver.late_threshold_minutes",
    value: "15",
    valueType: "INTEGER",
    description: "Minutes after scheduled departure before driver is considered late",
    category: "Driver",
    updatedBy: null,
    createdAt: "2026-01-03T23:45:57.828083",
    updatedAt: "2026-01-03T23:45:57.828083"
  },
  {
    id: "6cdbc99a-57fd-4cc9-b9b7-4c554d5b2094",
    key: "driver.max_late_count_monthly",
    value: "5",
    valueType: "INTEGER",
    description: "Maximum late arrivals allowed per month before review",
    category: "Driver",
    updatedBy: null,
    createdAt: "2026-01-03T23:45:57.828083",
    updatedAt: "2026-01-03T23:45:57.828083"
  },
  {
    id: "a4b26fe1-c607-472a-b2f6-ca3d5ba2e512",
    key: "driver.trusted_threshold_score",
    value: "80",
    valueType: "INTEGER",
    description: "Minimum credibility score to qualify as trusted driver",
    category: "Driver",
    updatedBy: null,
    createdAt: "2026-01-03T23:45:57.828083",
    updatedAt: "2026-01-03T23:45:57.828083"
  },
  {
    id: "cb627ddd-83e7-4794-8c58-4be7acc312b8",
    key: "gps.recording_interval_seconds",
    value: "30",
    valueType: "INTEGER",
    description: "Interval in seconds between GPS location recordings",
    category: "GPS",
    updatedBy: null,
    createdAt: "2026-01-03T23:45:57.828083",
    updatedAt: "2026-01-03T23:45:57.828083"
  },
  {
    id: "26579e39-c653-45ea-b62c-b4d291eb3957",
    key: "gps.retention_days",
    value: "90",
    valueType: "INTEGER",
    description: "Number of days to retain GPS tracking data",
    category: "GPS",
    updatedBy: null,
    createdAt: "2026-01-03T23:45:57.828083",
    updatedAt: "2026-01-03T23:45:57.828083"
  },
  {
    id: "92c6c757-91fc-4d49-ad67-e846770ce489",
    key: "gps.tracking_enabled",
    value: "true",
    valueType: "BOOLEAN",
    description: "Whether GPS tracking is enabled during rides",
    category: "GPS",
    updatedBy: null,
    createdAt: "2026-01-03T23:45:57.828083",
    updatedAt: "2026-01-03T23:45:57.828083"
  },
  {
    id: "0b1e019c-ce14-491c-9621-22521890744c",
    key: "payout.daily_limit",
    value: "500000",
    valueType: "INTEGER",
    description: "Maximum payout amount per day (XAF)",
    category: "Payout",
    updatedBy: null,
    createdAt: "2026-01-03T23:45:57.828083",
    updatedAt: "2026-01-03T23:45:57.828083"
  },
  {
    id: "43e012c1-24c0-4bd6-bb01-652298227121",
    key: "payout.min_amount",
    value: "1000",
    valueType: "INTEGER",
    description: "Minimum wallet balance required to request payout (XAF)",
    category: "Payout",
    updatedBy: null,
    createdAt: "2026-01-03T23:45:57.828083",
    updatedAt: "2026-01-03T23:45:57.828083"
  },
  {
    id: "449d7907-9d40-4265-8668-3af5ac33b141",
    key: "pricing.service_fee_enabled",
    value: "true",
    valueType: "BOOLEAN",
    description: "Whether service fee is applied to bookings",
    category: "Pricing",
    updatedBy: null,
    createdAt: "2026-01-04T02:04:05.486857",
    updatedAt: "2026-01-04T02:04:05.486857"
  },
  {
    id: "eab2809d-a10a-4067-b02a-8de54bed4a03",
    key: "pricing.service_fee_max",
    value: "2000",
    valueType: "INTEGER",
    description: "Maximum service fee amount (XAF)",
    category: "Pricing",
    updatedBy: null,
    createdAt: "2026-01-04T02:04:05.486857",
    updatedAt: "2026-01-04T02:04:05.486857"
  },
  {
    id: "4d96c1e9-37d7-4aa8-a046-3379361423c8",
    key: "pricing.service_fee_min",
    value: "100",
    valueType: "INTEGER",
    description: "Minimum service fee amount (XAF)",
    category: "Pricing",
    updatedBy: null,
    createdAt: "2026-01-04T02:04:05.486857",
    updatedAt: "2026-01-04T02:04:05.486857"
  },
  {
    id: "59f3e229-06e5-43f7-b278-30c1789b435c",
    key: "pricing.service_fee_percentage",
    value: "5",
    valueType: "INTEGER",
    description: "Service fee percentage charged to passengers on bookings",
    category: "Pricing",
    updatedBy: null,
    createdAt: "2026-01-04T02:04:05.486857",
    updatedAt: "2026-01-04T02:04:05.486857"
  },
  {
    id: "1b91b07f-d7b5-407c-84cb-2279f8466644",
    key: "rating.expiry_hours",
    value: "168",
    valueType: "INTEGER",
    description: "Hours until rating request expires (default 7 days)",
    category: "Rating",
    updatedBy: null,
    createdAt: "2026-01-04T02:04:05.096515",
    updatedAt: "2026-01-04T02:04:05.096515"
  },
  {
    id: "ef7a3f6d-eaea-41a6-a20c-eb6412b01774",
    key: "rating.max_reminders",
    value: "3",
    valueType: "INTEGER",
    description: "Maximum number of rating reminders to send",
    category: "Rating",
    updatedBy: null,
    createdAt: "2026-01-04T02:04:05.096515",
    updatedAt: "2026-01-04T02:04:05.096515"
  },
  {
    id: "285da270-77ae-4bc0-b852-e79afc776264",
    key: "rating.reminder_delay_hours",
    value: "24",
    valueType: "INTEGER",
    description: "Hours between rating reminders",
    category: "Rating",
    updatedBy: null,
    createdAt: "2026-01-04T02:04:05.096515",
    updatedAt: "2026-01-04T02:04:05.096515"
  },
  {
    id: "c5e940c3-94fa-424d-9fa3-eaedc08aaf3f",
    key: "rating.reminder_delay_minutes",
    value: "30",
    valueType: "INTEGER",
    description: "Minutes after ride completion before sending rating reminder",
    category: "Rating",
    updatedBy: null,
    createdAt: "2026-01-03T23:45:57.828083",
    updatedAt: "2026-01-03T23:45:57.828083"
  },
  {
    id: "21922cba-e181-4f7a-b2a6-65a5516819f8",
    key: "rating.reminder_enabled",
    value: "true",
    valueType: "BOOLEAN",
    description: "Whether to send rating reminders after ride completion",
    category: "Rating",
    updatedBy: null,
    createdAt: "2026-01-03T23:45:57.828083",
    updatedAt: "2026-01-03T23:45:57.828083"
  },
  {
    id: "d1e9254f-812e-4329-b9ee-137c5882bae5",
    key: "settlement.credit_delay_days",
    value: "3",
    valueType: "INTEGER",
    description: "Number of days to wait before crediting driver wallet after ride completion",
    category: "Settlement",
    updatedBy: null,
    createdAt: "2026-01-03T23:45:57.828083",
    updatedAt: "2026-01-03T23:45:57.828083"
  },
  {
    id: "7de8ed39-5925-4445-9807-bf0e5ba7a3b3",
    key: "settlement.platform_fee_percentage",
    value: "15",
    valueType: "INTEGER",
    description: "Default platform fee percentage for settlements",
    category: "Settlement",
    updatedBy: null,
    createdAt: "2026-01-03T23:45:57.828083",
    updatedAt: "2026-01-03T23:45:57.828083"
  },
  {
    id: "e64fe8a2-39f0-42d7-b6a5-6870aeef05c5",
    key: "settlement.trusted_driver_delay_days",
    value: "0",
    valueType: "INTEGER",
    description: "Credit delay days for trusted drivers (high credibility score)",
    category: "Settlement",
    updatedBy: null,
    createdAt: "2026-01-03T23:45:57.828083",
    updatedAt: "2026-01-03T23:45:57.828083"
  },
  {
    id: "525f4195-556c-477f-8eb2-f47c6c191ee8",
    key: "support.escalation.email",
    value: "",
    valueType: "STRING",
    description: "Email address for escalation notifications",
    category: "Support",
    updatedBy: null,
    createdAt: "2026-01-12T13:37:06.273547",
    updatedAt: "2026-01-12T13:37:06.273547"
  },
  {
    id: "bf364510-db90-4e4a-8723-7613fbae6cb4",
    key: "support.ticket.auto_close_days",
    value: "7",
    valueType: "INTEGER",
    description: "Days after resolution before auto-closing ticket",
    category: "Support",
    updatedBy: null,
    createdAt: "2026-01-12T13:37:06.273547",
    updatedAt: "2026-01-12T13:37:06.273547"
  },
  {
    id: "897c1f1f-ca69-49ab-9203-fcea4c5a9cde",
    key: "support.ticket.max_attachment_size_mb",
    value: "10",
    valueType: "INTEGER",
    description: "Maximum attachment size in MB",
    category: "Support",
    updatedBy: null,
    createdAt: "2026-01-12T13:37:06.273547",
    updatedAt: "2026-01-12T13:37:06.273547"
  },
  {
    id: "b567ec62-88d8-4aaa-bcd7-040bb973df49",
    key: "support.ticket.max_attachments",
    value: "5",
    valueType: "INTEGER",
    description: "Maximum attachments per ticket",
    category: "Support",
    updatedBy: null,
    createdAt: "2026-01-12T13:37:06.273547",
    updatedAt: "2026-01-12T13:37:06.273547"
  }
];

export const getCategoryIcon = (category: string) => {
  const icons: Record<string, string> = {
    "Booking": "CalendarCheck",
    "Chat": "MessageSquare",
    "Check-in": "UserCheck",
    "Driver": "Car",
    "GPS": "MapPin",
    "Payout": "Wallet",
    "Pricing": "DollarSign",
    "Rating": "Star",
    "Settlement": "Landmark",
    "Support": "HeadphonesIcon"
  };
  return icons[category] || "Settings";
};

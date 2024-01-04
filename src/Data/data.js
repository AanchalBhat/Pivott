export const leadIndustryArray = [
  "None",
  "Retails",
  "E-commerce",
  "Manufacturing",
  "Information Technology",
  "Software",
  "Hospitality",
  "Healthcare",
  "Food",
  "Government",
  "Telecom",
  "Other",
];

export const compnySizeArray = [
  "None",
  "0-50",
  "50-200",
  "500-1000",
  "1000-1500",
];

export const Arr = [
  {
    data: "Date of Creation",
    nm: "created_at",
  },
  {
    data: "Last Modification",
    nm: "last_modification",
  },
  {
    data: "Leads by Source",
    nm: "bySource",
  },
  {
    data: "Leads by Status",
    nm: "byStatus",
  },
  {
    data: "Leads by Stage/Score",
    nm: "byScore",
  },
  {
    data: "Leads by Country",
    nm: "byCountry",
  },
  {
    data: "Leads by City",
    nm: "byCity",
  },
  {
    data: "Leads by Employee Size",
    nm: "bySize",
  },
  {
    data: "Leads by Industry",
    nm: "byIndustry",
  },
];

export const taskArr = [
  {
    value: "in_progress",
    label: "In Progress",
  },
  {
    value: "started",
    label: "Started",
  },
  {
    value: "not_started",
    label: "Not Started",
  },
  {
    value: "completed",
    label: "Completed",
  },
];

export const PriorityArr = [
  {
    value: "high",
    label: "High",
  },
  {
    value: "medium",
    label: "Medium",
  },
  {
    value: "not_started",
    label: "Not Started",
  },
];

export const LeadsArr = [
  {
    data: "Date of Creation",
    nm: "created_at",
  },
  {
    data: "Last Modification",
    nm: "last_modification",
  },
  {
    data: "Leads by Source",
    nm: "bySource",
  },
  {
    data: "Leads by Status",
    nm: "byStatus",
  },
  {
    data: "Leads by Country",
    nm: "byCountry",
  },
  {
    data: "Leads by City",
    nm: "byCity",
  },
  {
    data: "Leads by Employee Size",
    nm: "bySize",
  },
  {
    data: "Leads by Industry",
    nm: "byIndustry",
  },
];

export const PotentialsArr = [
  {
    data: "Date of Creation",
    nm: "created_at",
  },
  {
    data: "Last Modification",
    nm: "last_modification",
  },
  {
    data: "Amount",
    nm: "byAmount",
  },
  {
    data: "Stage",
    nm: "byStage",
  },
];

export const DealsArr = [
  {
    data: "Date of Creation",
    nm: "created_at",
  },
  {
    data: "Last Modification",
    nm: "last_modification",
  },
  {
    data: "Deal Tenure",
    nm: "byTenure",
  },
  {
    data: "Deal Value",
    nm: "byValue",
  },
  {
    data: "Deal Term",
    nm: "byTerm",
  },
  {
    data: "Payment Mode",
    nm: "byPaymentTerm",
  },
];

export const pipelineArr = [
  {
    data: "Score",
    nm: "pipeline_score",
  },
  {
    data: "Expected Revenue",
    nm: "expected_revenue",
  },
  {
    data: "Campaign Source",
    nm: "campaign_sources",
  },
  {
    data: "Journey",
    nm: "journey",
  },
];

export const reportManualArr = [
  { id: "01", name: "All Reports" },
  // { id: 2, name: "My Reports" },
  { id: "02", name: "Favorite Reports" },
  { id: "03", name: "Recently Viewed" },
  { id: "04", name: "Shared" },
  { id: "05", name: "Scheduled" },
];

export const reportApiArr = [
  { id: 6, label: "folder 2" },
  { id: 7, label: "folder 3" },
  { id: 8, label: "folder 4" },
  { id: 9, label: "folder 5" },
];

// roles and permission module
export const activeUserData = [
  {
    id: 1,
    value: "All Users",
    title: "All Users",
  },
  {
    id: 2,
    value: "Active Users",
    title: "Active Users",
  },
  {
    id: 3,
    value: "Inactive Users",
    title: "Inactive Users",
  },
  {
    id: 4,
    value: "Invited Users",
    title: "Invited Users",
  },
  {
    id: 5,
    value: "Deleted Users",
    title: "Deleted Users",
  },
];

export const globalLeadsData = [
  {
    id: 1,
    name: "John Green",
    email: "john@gmail.com",
    role: "Super Admin",
    status: true,
  },
  {
    id: 2,
    name: "Alisha Sam ",
    email: "alisha@gmail.com",
    role: "Executive",
    status: false,
  },
  {
    id: 3,
    name: "Ammie Joe",
    email: "ammie@gmail.com",
    role: "Manager",
    status: true,
  },
  {
    id: 4,
    name: "Alley Blue",
    email: "alley@gmail.com",
    role: "Admin",
    status: false,
  },
  {
    id: 5,
    name: "Chris Red",
    email: "chris@gmail.com",
    role: "Admin",
    status: true,
  },
  {
    id: 6,
    name: "John Green",
    email: "john@gmail.com",
    role: "Super Admin",
    status: true,
  },
  {
    id: 7,
    name: "Alisha Sam ",
    email: "alisha@gmail.com",
    role: "Executive",
    status: false,
  },
  {
    id: 8,
    name: "Ammie Joe",
    email: "ammie@gmail.com",
    role: "Manager",
    status: true,
  },
  {
    id: 9,
    name: "Alley Blue",
    email: "alley@gmail.com",
    role: "Admin",
    status: false,
  },
  {
    id: 10,
    name: "Chris Red",
    email: "chris@gmail.com",
    role: "Admin",
    status: true,
  },
];

export const listData = [
  { name: "Leads:", id: "1", value: "leads" },
  { name: "Pipelines:", id: "2", value: "pipelines" },
  { name: "Potentials:", id: "3", value: "potentials" },
  { name: "Deals:", id: "4", value: "deals" },
  { name: "Lost Leads:", id: "5", value: "lost_leads" },
  { name: "Reports:", id: "6", value: "reports" },
  // { name: "Email Campaigns:", id: "8" },
  // { name: "Social Media Campaigns:", id: "9" },
];

export const radioBtnData = [
  {
    title: "Read Only",
    value: "Read Only",
  },
  {
    title: "Read/Create/Edit",
    value: "Read/Create/Edit",
  },
  {
    title: "Read/Create/Edit/Delete",
    value: "Read/Create/Edit/Delete",
  },
  {
    title: "Read/Create/Edit/Delete/Assign",
    value: "Read/Create/Edit/Delete/Assign",
  },
];

export const perdata = {
  "deals": {
      "is_list": true,
      "is_read": true,
      "is_assign": false,
      "is_create": false,
      "is_delete": false,
      "is_update": false
  },
  "leads": {
      "is_list": true,
      "is_read": true,
      "is_assign": false,
      "is_create": true,
      "is_delete": false,
      "is_update": true
  },
  "users": {
      "is_list": true,
      "is_read": true,
      "is_assign": true,
      "is_create": true,
      "is_delete": true,
      "is_update": true
  },
  "reports": {
      "is_list": true,
      "is_read": true,
      "is_assign": false,
      "is_create": true,
      "is_delete": true,
      "is_update": true
  },
  "pipelines": {
      "is_list": true,
      "is_read": true,
      "is_assign": false,
      "is_create": false,
      "is_delete": false,
      "is_update": false
  },
  "dashboard": {
      "is_list": true,
      "is_read": true,
      "is_assign": true,
      "is_create": true,
      "is_delete": true,
      "is_update": true
  },
  "lost_leads": {
      "is_list": true,
      "is_read": true,
      "is_assign": true,
      "is_create": true,
      "is_delete": true,
      "is_update": true
  },
  "potentials": {
      "is_list": true,
      "is_read": true,
      "is_assign": true,
      "is_create": true,
      "is_delete": true,
      "is_update": true
  }
}

export const transactionData = [
  {
    id:0,
    plan: "Pro plan",
    purchaseDate: "22 Nov 2023",
    users: "5",
    billedType: "Annually",
    amount: "299",
    totalPaid: "17,980.00"
  },
  {
    id:1,
    plan: "Pro plan",
    purchaseDate: "21 Nov 2023",
    users: "6",
    billedType: "Monthly",
    amount: "349.00",
    totalPaid: "29,940.00"
  },
  {
    id:2,
    plan: "Pro plan",
    purchaseDate: "20 Nov 2023",
    users: "7",
    billedType: "Annually",
    amount: "0.00",
    totalPaid: "17,980.00"
  },
]
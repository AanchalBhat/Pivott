// lead
export const leadDefaultList = [
  {
    id: 0,
    data: "Company",
    field_name: "company_name",
  },
  {
    id: 1,
    data: "Email",
    field_name: "email",
  },
  {
    id: 2,
    data: "Phone",
    field_name: "phone_number",
  },
  {
    id: 3,
    data: "Lead Source",
    field_name: "lead_source_id",
  },

  {
    id: 4,
    data: "Website",
    field_name: "website",
  },
  {
    id: 5,
    data: "Lead Status",
    field_name: "status_id",
  },
  {
    id: 6,
    data: "Street Address",
    field_name: "street_address",
  },
  {
    id: 7,
    data: "Zip Code",
    field_name: "zip_code",
  },
  {
    id: 8,
    data: "Lead Owner",
    field_name: "owner",
  },
];


// pipeline 
export const pipelineDefaultList = [
  {
    id: 0,
    data: "Email",
    field_name: "email",
  },
  {
    id: 1,
    data: "Score",
    field_name: "pipeline_score",
  },
  {
    id: 2,
    data: "Stage",
    field_name: "pipeline_stage_id",
  },
  {
    id: 3,
    data: "Phone",
    field_name: "phone_number",
  },
  {
    id: 4,
    data: "Pipeline Owner",
    field_name: "owner",
  },
  {
    id: 5,
    data: "Next Step",
    field_name: "next_step",
  },
  {
    id: 6,
    data: "Company",
    field_name: "company_name",
  },
  {
    id: 7,
    data: "Expected Revenue",
    field_name: "expected_revenue",
  },
];

// potential
export const potentialDefaultList = [
  {
    id: 0,
    data: "Company",
    field_name: "company_name",
  },
  {
    id: 1,
    data: "Email",
    field_name: "email",
  },
  {
    id: 2,
    data: "Phone",
    field_name: "phone_number",
  },
  {
    id: 3,
    data: "Lead Source",
    field_name: "lead_source_id",
  },
  {
    id: 4,
    data: "Potential Owner",
    field_name: "owner",
  },
  {
    id: 5,
    data: "Stage",
    field_name: "potential_stage_id",
  },
  {
    id: 6,
    data: "Amount",
    field_name: "amount",
  },
];


//deals
export const dealsDefaultList = [
  {
    id: 0,
    data: "Sign off date",
    field_name: "sign_off_date",
  },
  {
    id: 1,
    data: "Deal value",
    field_name: "value",
  },
  {
    id: 2,
    data: "Payment Mode",
    field_name: "payment_mode_id",
  },
  {
    id: 3,
    data: "Deal Tenure",
    field_name: "tenure",
  },
  {
    id: 4,
    data: "Deal Terms",
    field_name: "deal_terms",
  },
  {
    id: 5,
    data: "Company",
    field_name: "company_name",
  },
  {
    id: 6,
    data: "Email",
    field_name: "email",
  },
  {
    id: 7,
    data: "Phone",
    field_name: "phone_number",
  },
  {
    id: 8,
    data: "Deal Owner",
    field_name: "owner",
  },
];

// lostleads
export const lostLeadsDefaultList = [
  {
    id: 0,
    data: "Company",
    field_name: "company",
  },
  {
    id: 1,
    data: "Email",
    field_name: "email",
  },
  {
    id: 2,
    data: "Phone",
    field_name: "phone_number",
  },
  {
    id: 3,
    data: "Lead Owner",
    field_name: "owner",
  },
  {
    id: 4,
    data: "Reason for lost",
    field_name: "reason",
  },
];

//dashboard


export const dashboardList = [
  {
    id: 0,
    data: "Leads",
    field_name: "leads",
    sub_fields: [
      {
        field_name: "Untouched Leads",
        value: "untouched_leads",
      },
      {
        field_name: "Assigned Leads",
        value: "assigned_leads",
      },
      {
        field_name: "Added Leads",
        value: "added_leads",
      },
    ],
  },
  {
    id: 1,
    data: "Pipelines",
    field_name: "pipelines",
    sub_fields: [
      {
        field_name: "By Stage Type Count",
        value: "stage_type_count",
      },
      {
        field_name: "Pipelines This Month",
        value: "pipelines_this_month",
      },
      {
        field_name: "Assigned Pipelines",
        value: "assigned_pipelines",
      },
    ],
  },
  {
    id: 2,
    data: "Potentials",
    field_name: "potentials",
    sub_fields: [
      {
        field_name: "By Stage Type Count",
        value: "stage_type_count",
      },
      {
        field_name: "Potentials This Month",
        value: "potentials_this_month",
      },
      {
        field_name: "Assigned Potentials",
        value: "assigned_potentials",
      },
    ],
  },
  {
    id: 3,
    data: "Deals",
    field_name: "deals",
    sub_fields: [
      {
        field_name: "Assigned Deals",
        value: "assigned_deals",
      },
      /* uncomment when open and close deals feature are discussed */
      // {
      //   field_name: "Open Deals",
      //   value: "open_deals",
      // },
      // {
      //   field_name: "Closed Deals",
      //   value: "close_deals",
      // },
      {
        field_name: "Deals This Month",
        value: "deals_this_month",
      },
    ],
  },
  {
    id: 4,
    data: "Lost Leads",
    field_name: "lost_leads",
    sub_fields: [
      {
        field_name: "Assigned Lost Leads",
        value: "assigned_lost_leads",
      },
      {
        field_name: "By Lost Lead Reason Type",
        value: "reason_type_count",
      },
      {
        field_name: "Lost Lead This Month",
        value: "lost_leads_this_month",
      },
    ],
  },
  {
    id: 5,
    data: "My Calls",
    field_name: "calls",
    sub_fields: [
      {
        field_name: "Upcoming Calls",
        value: "upcoming_calls",
      },
      {
        field_name: "Calls This Week",
        value: "calls_this_week",
      },
    ],
  },
];

export const pipelineStageArr = [
  {
    name: "Other",
    value: "other",
  },
  {
    name: "Fee Paid",
    value: "fee_paid",
  },
  {
    name: "POC Fee",
    value: "poc_fee",
  },
  {
    name: "Demo",
    value: "demo",
  },
  {
    name: "Documentation",
    value: "documentation",
  },
]

export const potentialStageArr = [
  {
    name: "Negotiations",
    value: "negotiations",
  },
  {
    name: "Proposal",
    value: "proposal",
  },
  {
    name: "Value Proposition",
    value: "value_proposition",
  },
  {
    name: "Qualification",
    value: "qualification",
  },
  {
    name: "Needs Analysis",
    value: "needs_analysis",
  },
]

export const lostReasonsArr = [
  {
    name: "Other",
    value: "other",
  },
  {
    name: "Project On Hold",
    value: "project_on_hold",
  },
  {
    name: "Non Responsive",
    value: "non_responsive",
  },
  {
    name: "Manangement Dropout",
    value: "manangement_dropout",
  },
  {
    name: "Timelines",
    value: "timelines",
  },
  {
    name: "Technical Reasons",
    value: "technical_reasons",
  },
  {
    name: "Budget",
    value: "budget",
  },
]

//roles nd permission
export const rolesAndPermission = [

  {
    id: 0,
    data: "Designation",
    field_name: "designation",
  },
  {
    id: 1,
    data: "Role",
    field_name: "role_id",
  },
  {
    id: 2,
    data: "Email",
    field_name: "email",
  },
];





//home api
export const CONTACT_US = '/contact_us'

//call api
export const CALLS = '/call_informations'
export const GET_CALL_TYPE = '/call_types'
//deal api
export const DEAL_CREATE = '/deals'
export const DEAL_TYPE = '/stage_types?search[section]=deal'
export const DEAL_OWNER = '/users'
export const DEAL_STAGE = '/potential_stages'
export const CONTACT_DETAILS_DATA = '/deals/get_contact_details'
export const DEAL_WON = '/deals/deals_won'
export const DEAL_REASON = '/reasons'
export const PAYMENT_MODE = '/payment_modes'
// forgot api
export const FORGET_PASSWORD = '/users/password'
//lead api
export const LEADS = '/leads'
export const MANAGE_LEADS = '/manage_data'
export const LEAD_TRANSFER = '/leads/lead_mass_transfer'
export const UPLOAD_FILE = '/leads/file_upload'
export const LEAD_FILE_DOWNLOAD = '/leads/download_template'
export const LEAD_STATUS = '/statuses'
export const LEADS_MANAGE_SHOW = '/manage_data/?data[manage_data_type]'
export const WEBEX_QUERY = '/meetings/auth'
export const ASSIGN_COMPANY = '/users/assign_company'
export const LEAD_SOURCES = '/lead_sources'
export const INDUSTRIES = '/industries'
export const COMPANY_SIZES = '/company_sizes'
//login api
export const LOGIN = '/users/sign_in'
export const COMPANIES = '/companies'
export const GOOGLE_LOGIN = '/auths/google_omniauth'
export const GOOGLE_URI = '/auths/authorization_url'
export const MICROSOFT_LOGIN = '/auths/microsoft_auth'
export const MICROSOFT_URI = '/auths/microsoft_auth_url'
//lost lead api
export const LOST = '/lost_leads'
export const LOST_OVERVIEW = '/lost_leads/get_lost_lead'
export const LOST_CONVERT = '/lost_leads/lost_leads_convert'
export const LOST_DELETE = '/lost_leads/lost_lead_mass_delete'
export const LOST_MASS_DELETE = '/lost_leads/lost_lead_mass_delete'
export const LOST_SEARCH = '/lost_leads'
export const LOST_MANAGE = '/manage_data/?data[manage_data_type]'
export const LOST_MASS_TRANSFER = '/lost_leads/lost_lead_mass_transfer'
export const LOST_REASONS = '/reasons'
//Meeting api
export const MEETINGS = '/meetings'
export const MEETING_THIRDPARTY = '/meetings/third_party_connectivity'
export const LANGUAGES = '/contact_details/language_list'
//notes api
export const NOTES = '/notes'
//pipeline api
export const CREATE_PIPELINE = '/pipelines'
export const PIPELINE_TYPE = '/stage_types?search[section]=pipeline'
export const PIPELINE_OWNER = '/users'
export const PIPELINE_STAGE = '/pipeline_stages'
export const PIPELINE_SCORE = '/pipeline_scores'
export const GET_PIPELINE = '/pipelines'
export const PIPELINE_LOST = '/lost_leads'
export const PIPELINE_WON = '/pipelines/pipeline_won'
export const PIPELINE_TRANSFER = '/pipelines/pipeline_mass_transfer'
//potential api
export const CREATE_POTENTIAL = '/potentials'
export const POTENTIAL_TYPE = '/stage_types?search[section]=potential'
export const POTENTIAL_OWNER = '/users'
export const POTENTIAL_STAGE = '/potential_stages'
export const POTENTIAL_WON = '/potentials/potential_won'
export const POTENTIAL_REASON = '/reasons'
export const POTENTIAL_TRANSFER = '/potentials/potential_mass_transfer'
export const POTENTIAL_STAGETYPE = '/stage_types'
//report api
export const GET_REPORT = '/reports'
export const GET_REPORT_FOLDER = '/report_folders'
export const SCHEDULE_REPORT = '/reports/schedule_reports'
export const MOVE_FOLDER = '/reports/move_to_folder'
//send email api
export const LEAD_EMAIL = '/lead_emails'
//sign up api
export const SIGNUP = '/users'
export const GET_EMAIL_N_COMP = '/users/invitation/fetch'
export const COMPANY = '/companies/is_company_exists'
export const ISEMAILVALID = '/email_otps/check_company_domain'
//tasks api
export const TASKS = '/tasks'
//update pass api
export const RESET_PASSWORD = '/users/password'
export const CHANGE_PASSWORD = '/update_password'
// user api
export const GET_USER = '/users'
export const INVITE_USERS = '/users/invitation'
export const ROLE = '/roles'
//Varify email api
export const VERIFY_EMAIL = '/email_otps/match_otp'
export const RESEND_OTP = '/email_otps'
export const VERIFY_TWOFACTOR = '/two_factor_verifications/verify_otp'
export const RESEND_TWOFACTOR_OTP = '/two_factor_verifications/send_otp'
// third party meetings url
export const GET_WEBEX = '/auths/webex_auth_url'
export const WEBEX_CODE_LOGIN = '/meetings/auth'
export const GET_SKYPE = '/auths/skype_auth_url'
export const SKYPE_CODE_LOGIN = '/meetings/skype_auth'
export const GET_GOOGLE = '/auths/authorization_url'
export const GOOGLE_CODE_LOGIN = '/meetings/google_meet_auth'
// Notifications
export const GET_NOTIFICATION = '/notifications'
export const UNREAD_COUNT = '/unread_count'
export const READ_NOTIFICATION = '/notifications/mark_read'
//sessions logout
export const SESSIONS_LOGOUT = '/users/sign_out_all'
//Dashboard api
export const DASHBOARD = '/dashboard'
export const MEETING_DATA = '/dashboard/meeting_stats'
export const DASHBOARD_DEAL = '/dashboard/deals_stats'
export const DASHBOARD_TASK = '/dashboard/tasks_stats'
//roles and permissions url
export const DEACTIVATE_USER = '/deactivate_users'
export const ACTIVATE_USER = '/activate_users'
export const GET_PERMISSION = '/permissions'
export const GET_PARENT_NODE = '/user_manager_hierarchy'
export const GET_CHILD_NODE = '/user_manager_hierarchy/show_children'
//Profile management

export const ACTIVE_USERS = '/users'
export const MANAGE_DATA_ROLES = '/manage_data'
export const SOCIAL_LOADER = '/auth_callback'
// contact details
export const CONTACT_DETAILS = '/contact_details'
export const TIMEZONE = '/timezones'
export const CURRENCY = '/currencies'

//campaign
export const CAMPAIGN_LIST = '/email_campaigns'
export const RECIPIENT_LIST = '/contact_details/recipient_listing'
export const CANCEL_ARCHIVE = '/cancel_and_archive'
export const CAMPAIGN_RECIPIENTS = '/email_campaign_recipients'
export const CAMPAIGN_DUPLICATION = '/email_campaigns/campaign_duplication'

//subscriptions
export const SUBSCRIPTIONS = '/subscriptions'
export const CURRENT_PLAN = '/company_subscriptions/1'
export const TRANSACTION_HISTORY = '/subscriptions/transaction_history'

//template apis
export const CAMPAIGN_TEMPLATES = '/email_campaign_templates'
export const IMAGE_TEMPLATE = '/email_campaign_template_images'
export const MASTER_TEMPLATES = '/master_templates'

// email campaigns
export const EMAIL_CAMPAIGN = '/email_campaigns'
export const CAMPAIGN_MASS_DELETE = '/email_campaigns/campaign_mass_delete'
export const ARCHIVE_CAMPAIGNS = '/archive_campaigns'
export const MOVE_ARCHIVE_CAMPAIGNS = '/move_to_campaign'
export const CANCEL_CAMPAIGNS = '/email_campaigns/cancel_campaign'
export const DUPLICATE_NAME = '/email_campaigns/get_duplicate_campaign_name'
export const CAMPAIGN_MASS_RENAME = '/email_campaigns/campaign_mass_renaming'
export const DUPLICATE_TEMPLATE = '/template_duplication'
export const SEND_TEST_EMAIL = '/send_test_emails'
export const START_CAMPAIGN = '/users/update_campaign_status'

//getlink role and permission
export const GET_LINK_INVITATION = '/companies/get_invitation_token'
export const FETCH_COMPANY = '/companies/fetch_company'

// whiteList company domin
export const COMPANY_DOMAINS = '/company_domains'
// email tags
export const EMAIL_TAGS = "/email_tags";

// contact-list
export const CONTACT_LISTS = '/contact_details'
export const CONTACT_CATEGORIES = '/contact_categories'
export const CREATE_LIST = '/contact_categories/create_new_list'
export const RENAME_CATEGORIES = '/contact_categories/rename_contact_category'
export const COPY_TO_LIST = '/contact_categories/copy_to_list'
export const DUPLICATE_LIST = '/contact_categories/duplicate_list'
export const EXPORT_CONTACTS ='/contact_details/export_contacts'

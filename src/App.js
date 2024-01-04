import React, { Suspense, lazy, useContext, useEffect } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'
import './App.css'
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom'
import PrivateRoute from './PrivateRoute'
import { DataContext } from './context'
import '@fontsource/poppins'
import IdleTimeout from '../src/constants/IdleTimeout'
import { DeviceUUID } from 'device-uuid'
import { lazyRetry, renderLazyLoader } from './utils/chunkHandle'
import LandingPage from './pages/Main/LandingPage'
import Login from './pages/Login/Login'
import Signup from './pages/Signup/Signup'
import Recipients from './pages/EmailCampaigns/Recipients'
import LazyLoader from './components/routesContainer'

// adding pages

import Notes from './pages/Notes'
import Tasks from './pages/Tasks'
import Meetings from './pages/Meetings'
import Calls from './pages/Calls'
import LeadDetailsComponent from './pages/LeadDetails'
import DataPermissionPage from './pages/RolesPermissions/DataPermissionPage'
import Campaigns from './pages/EmailCampaigns/Lists'
import Templates from './pages/EmailCampaigns/TemplateList'
import Drafts from './pages/EmailCampaigns/Drafts'
import Archive from './pages/EmailCampaigns/Archive'
import WhiteListDomin from './pages/AccountDetail/WhiteListDomin'
import CurrentPlans from './pages/Main/Subscription/CurrentPlans'
import TransactionHistorys from './pages/Main/Subscription/TransactionHistorys'
import PaymentMethods from './pages/Main/Subscription/PaymentMethods'
import Currency from "./pages/AccountDetail/Currency";

const LeadOverview = LazyLoader(
  lazy(() =>
    lazyRetry(() => import('./components/Leads/Overview'), 'leadOverview')
  )
)

const PipelineOverview = LazyLoader(
  lazy(() =>
    lazyRetry(
      () =>
        import(
          './components/Pipeline/Details/PipelineOverview/PipelineOverview'
        ),
      'pipelineOverview'
    )
  )
)
const PotentialOverview = LazyLoader(
  lazy(() =>
    lazyRetry(
      () =>
        import(
          './components/Potential/Details/PotentialOverview/PotentialOverview'
        ),
      'potentialOverview'
    )
  )
)
const DealOverview = LazyLoader(
  lazy(() =>
    lazyRetry(
      () => import('./components/Deals/Details/DealsOverview/DealsOverview'),
      'dealOverview'
    )
  )
)
const LostOverview = LazyLoader(
  lazy(() =>
    lazyRetry(
      () => import('./components/LostLeads/Overview/Overview'),
      'lostOverview'
    )
  )
)

const ManageUsers = LazyLoader(
  lazy(() =>
    lazyRetry(
      () => import('./pages/RolesPermissions/ManageUsers'),
      'roles-users'
    )
  )
)

const UserDetails = LazyLoader(
  lazy(() =>
    lazyRetry(
      () => import('./pages/RolesPermissions/UserDetails'),
      'roles-details'
    )
  )
)
const SocialLoading = LazyLoader(
  lazy(() =>
    lazyRetry(
      () => import('./components/SocialLoading/SocialLoading'),
      'social-load'
    )
  )
)
const ThirdParty = LazyLoader(
  lazy(() =>
    lazyRetry(() => import('./components/ThirdParty/index'), 'thirdParty')
  )
)
const VerifyEmail = LazyLoader(
  lazy(() =>
    lazyRetry(() => import('./pages/VerifyEmail/VerifyEmail'), 'verifyEmail')
  )
)
const ForgotPassword = LazyLoader(
  lazy(() =>
    lazyRetry(
      () => import('./pages/AccountActivation/ForgotPassword'),
      'forgotPswrd'
    )
  )
)
const UpdatePassword = LazyLoader(
  lazy(() =>
    lazyRetry(
      () => import('./pages/AccountActivation/UpdatePassword'),
      'updatePswrd'
    )
  )
)
const ChangePassword = LazyLoader(
  lazy(() =>
    lazyRetry(
      () => import('./pages/AccountActivation/ChangePassword'),
      'changePassword'
    )
  )
)
const PasswordResetSuccess = LazyLoader(
  lazy(() =>
    lazyRetry(
      () => import('./pages/AccountActivation/PasswordResetSuccess'),
      'pswrdResetSuccess'
    )
  )
)
const PageNotFound = LazyLoader(
  lazy(() =>
    lazyRetry(
      () => import('./components/NotFound/PageNotFound'),
      'pageNotFound'
    )
  )
)
const CompanyIdPopup = LazyLoader(
  lazy(() =>
    lazyRetry(
      () => import('./components/Leads/CompanyIdPopup/CompanyIdPopup'),
      'companyId'
    )
  )
)
const ServerStatus = LazyLoader(
  lazy(() =>
    lazyRetry(
      () => import('./components/NotFound/ServerStatus'),
      'serverStatus'
    )
  )
)
const AboutUs = LazyLoader(
  lazy(() => lazyRetry(() => import('./pages/Main/AboutUs'), 'aboutUs'))
)
const ContactUs = LazyLoader(
  lazy(() => lazyRetry(() => import('./pages/Main/ContactUs'), 'contactUs'))
)
const PrivacyPolicy = LazyLoader(
  lazy(() =>
    lazyRetry(() => import('./pages/Main/PrivacyPolicy'), 'privacy-policy')
  )
)
const TermsConditions = LazyLoader(
  lazy(() =>
    lazyRetry(() => import('./pages/Main/TermsConditions'), 'terms-conditions')
  )
)
const UsagePolicy = LazyLoader(
  lazy(() => lazyRetry(() => import('./pages/Main/UsagePolicy'), 'policy'))
)
const UserOverviewChild = LazyLoader(
  lazy(() => lazyRetry(() => import('./pages/UserOverviewChild'), 'userChild'))
)
const CampaignOverview = LazyLoader(
  lazy(() =>
    lazyRetry(
      () => import('./pages/EmailCampaigns/OverviewData'),
      'campaign-overview'
    )
  )
)
const DesignTemplate = LazyLoader(
  lazy(() =>
    lazyRetry(
      () => import('./components/Email Campaigns/EmailTemplate/Design'),
      'second-editor'
    )
  )
)
const WhyPivott = LazyLoader(
  lazy(() => lazyRetry(() => import('./pages/Main/WhyPivott'), 'whyPivott'))
)
const Blog = LazyLoader(
  lazy(() => lazyRetry(() => import('./pages/Main/Blog'), 'blog'))
)
const BlogDetails = LazyLoader(
  lazy(() =>
    lazyRetry(() => import('./pages/Main/BlogDetails'), 'blog-details')
  )
)
const EasyEditor = LazyLoader(
  lazy(() =>
    lazyRetry(
      () => import('./components/Email Campaigns/EmailTemplate/Editor'),
      'editor'
    )
  )
)

const Preview = LazyLoader(
  lazy(() =>
    lazyRetry(
      () =>
        import('./components/Email Campaigns/EmailTemplate/TemplatePreview'),
      'preview'
    )
  )
)
const StartCampaign = LazyLoader(
  lazy(() =>
    lazyRetry(
      () => import('./components/Email Campaigns/StartCampaign'),
      'startCampaign'
    )
  )
)
const CreateCampaign = LazyLoader(
  lazy(() =>
    lazyRetry(
      () => import('./components/Email Campaigns/CreateCampaign'),
      'createCampaign'
    )
  )
)
const LeadsList = LazyLoader(
  lazy(() => lazyRetry(() => import('./pages/Leads/List'), 'leadlist'))
)
const LeadsCreate = LazyLoader(
  lazy(() => lazyRetry(() => import('./pages/Leads/Create'), 'createLead'))
)
const LeadsUpdate = LazyLoader(
  lazy(() => lazyRetry(() => import('./pages/Leads/Create'), 'updateLead'))
)
const Dashboard = LazyLoader(
  lazy(() => lazyRetry(() => import('./pages/Dashboard'), 'dashboard'))
)
const AppsBar = LazyLoader(
  lazy(() => lazyRetry(() => import('./components/AppsBar'), 'appsbar'))
)
const BoardPipeline = LazyLoader(
  lazy(() => lazyRetry(() => import('./pages/Pipeline/Board'), 'kanban'))
)
const CreatePipeline = LazyLoader(
  lazy(() =>
    lazyRetry(() => import('./pages/Pipeline/Create'), 'createpipeline')
  )
)
const UpdatePipeline = LazyLoader(
  lazy(() =>
    lazyRetry(() => import('./pages/Pipeline/Create'), 'updatepipeline')
  )
)
const Pipeline = LazyLoader(
  lazy(() => lazyRetry(() => import('./pages/Pipeline/List'), 'pipelineList'))
)
const LeadDetailEditPipeline = LazyLoader(
  lazy(() =>
    lazyRetry(() => import('./pages/common/leadDetails'), 'lead-details-pipe')
  )
)
const LeadDetailEditPotential = LazyLoader(
  lazy(() =>
    lazyRetry(() => import('./pages/common/leadDetails'), 'lead-details-pote')
  )
)
const LeadDetailEditDeal = LazyLoader(
  lazy(() =>
    lazyRetry(() => import('./pages/common/leadDetails'), 'lead-details-deal')
  )
)
const CreatePotential = LazyLoader(
  lazy(() =>
    lazyRetry(() => import('./pages/Potential/Create'), 'createpotential')
  )
)
const UpdatePotential = LazyLoader(
  lazy(() =>
    lazyRetry(() => import('./pages/Potential/Create'), 'updatepotential')
  )
)
const Potential = LazyLoader(
  lazy(() => lazyRetry(() => import('./pages/Potential/List'), 'potentialList'))
)
const MyAccountDetails = LazyLoader(
  lazy(() =>
    lazyRetry(() => import('./pages/AccountDetail/MyAccountDetails'), 'profile')
  )
)

const CreateDeals = LazyLoader(
  lazy(() => lazyRetry(() => import('./pages/Deals/Create'), 'createdeal'))
)
const UpdateDeals = LazyLoader(
  lazy(() => lazyRetry(() => import('./pages/Deals/Create'), 'updatedeal'))
)
const Deals = LazyLoader(
  lazy(() => lazyRetry(() => import('./pages/Deals/List'), 'deallist'))
)
const LostLists = LazyLoader(
  lazy(() =>
    lazyRetry(() => import('./components/LostLeads/LostLeadsList'), 'lostlist')
  )
);
const ContactList= LazyLoader(
  lazy(() =>
    lazyRetry(() => import("./components/ContactLists/ContactList"), "contactlist")
  )
)
const EditDetails = LazyLoader(
  lazy(() =>
    lazyRetry(
      () => import('../src/components/AccountDetails/EditDetails'),
      'profileEdit'
    )
  )
)
const Report = LazyLoader(
  lazy(() => lazyRetry(() => import('./pages/Reports/List'), 'reportlist'))
)
const CreateReports = LazyLoader(
  lazy(() =>
    lazyRetry(
      () => import('./components/Reports/CreateReports'),
      'createReport'
    )
  )
)
const UpdateReports = LazyLoader(
  lazy(() =>
    lazyRetry(
      () => import('./components/Reports/CreateReports'),
      'updateReport'
    )
  )
)
const ListReports = LazyLoader(
  lazy(() =>
    lazyRetry(() => import('./components/Reports/ListReports'), 'reportInlist')
  )
)
const GlobalSearch = LazyLoader(
  lazy(() =>
    lazyRetry(
      () => import('./components/GlobalSearch/GlobalSearch'),
      'globalSearch'
    )
  )
)
const Password = LazyLoader(
  lazy(() =>
    lazyRetry(() => import('./components/Personal/Password'), 'passwordSet')
  )
)

const AppLayout = props => (
  <>
    <Suspense fallback={<AppsBar title={props?.title} />}>
      <AppsBar title={props?.title} />
    </Suspense>
  </>
)

function App () {
  const { setDeviceAddress } = useContext(DataContext)

  const DeviceAddress = () => {
    var uuid = new DeviceUUID().get()
    setDeviceAddress(uuid)
  }
  const logOut = () => {
    if (window.location.pathname === '/login') {
      return
    }
    localStorage.clear();
    return <Navigate to="/login" replace />;
    // setTimeout(() => (window.location.pathname = "/login"), 300);
  };

  const Authenticate = ({ children }) => {
    const token = localStorage.getItem('token')
    const isAuthenticated = token ? true : false
    if (isAuthenticated) {
      return <Navigate to='/dashboard' replace />
    }
    return children
  }
  useEffect(() => {
    DeviceAddress()
    AOS.init()
    AOS.refresh()
  }, [])

  return (
    <>
      <IdleTimeout logOut={() => logOut()} />
      <div className='App'>
        {/* <Suspense fallback={renderLazyLoader()}> */}
        <BrowserRouter>
          <Routes>
            <Route exact path='/' element={<LandingPage />} />{' '}
            <Route exact path='/about-us' element={<AboutUs />} />{' '}
            <Route exact path='/contact-us' element={<ContactUs />} />{' '}
            <Route exact path='/blogs' element={<Blog />} />{' '}
            <Route exact path='/blogs/:title' element={<BlogDetails />} />{' '}
            <Route exact path='/privacy-policy' element={<PrivacyPolicy />} />{' '}
            <Route exact path='/privacyPolicy' element={<PrivacyPolicy />} />
            <Route exact path='/tnc' element={<TermsConditions />} />{' '}
            <Route exact path='/usage-policy' element={<UsagePolicy />} />{' '}
            <Route exact path='/why-pivott' element={<WhyPivott />} />{' '}
            <Route exact path='/auth-callback' element={<SocialLoading />} />
            <Route
              path='/login'
              element={
                <Authenticate>
                  {' '}
                  <Login />{' '}
                </Authenticate>
              }
            />
            <Route
              path='/signup'
              element={
                <Authenticate>
                  {' '}
                  <Signup />{' '}
                </Authenticate>
              }
            />
            <Route exact path='/verify-email' element={<VerifyEmail />} />
            <Route exact path='/forgot-password' element={<ForgotPassword />} />
            <Route exact path='/update-password' element={<UpdatePassword />} />
            <Route exact path='/change-password' element={<ChangePassword />} />
            <Route
              exact
              path='/password-reset-success'
              element={<PasswordResetSuccess />}
            />
            <Route exact path='/update-company' element={<CompanyIdPopup />} />
            <Route element={<AppLayout title='Dashboard' />}>
              {' '}
              <Route
                exact
                path='/dashboard'
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />{' '}
            </Route>
            <Route element={<AppLayout title='Leads' />}>
              {' '}
              <Route
                exact
                path='/lead'
                element={
                  <PrivateRoute>
                    <LeadsList />
                  </PrivateRoute>
                }
              />{' '}
            </Route>
            <Route element={<AppLayout title='Leads' />}>
              {' '}
              <Route
                exact
                path='/lead/create'
                element={
                  <PrivateRoute>
                    <LeadsCreate />
                  </PrivateRoute>
                }
              />
              <Route
                exact
                path='/lead/update/:id'
                element={
                  <PrivateRoute>
                    <LeadsUpdate />
                  </PrivateRoute>
                }
              />
              <Route
                exact
                path='/lead/:id/note'
                element={
                  <PrivateRoute>
                    <Notes type='Lead' />
                  </PrivateRoute>
                }
              />
              <Route
                exact
                path='/lead/:id/overview'
                element={
                  <PrivateRoute>
                    <LeadOverview />
                  </PrivateRoute>
                }
              />
              <Route
                exact
                path='/lead/:id/task'
                element={
                  <PrivateRoute>
                    <Tasks type='Lead' />
                  </PrivateRoute>
                }
              />
              <Route
                exact
                path='/lead/:id/meeting'
                element={
                  <PrivateRoute>
                    <Meetings type='Lead' />
                  </PrivateRoute>
                }
              />
              <Route
                exact
                path='/lead/:id/call-information'
                element={
                  <PrivateRoute>
                    <Calls type='Lead' />
                  </PrivateRoute>
                }
              />
            </Route>
            <Route element={<AppLayout title='Leads' />}>
              {' '}
              <Route
                exact
                path='/lead/overview'
                element={
                  <PrivateRoute>
                    <LeadOverview />
                  </PrivateRoute>
                }
              />{' '}
              {/* </Route> */}
            </Route>
            {/* pipeline routes===== */}
            <Route element={<AppLayout title='Pipelines' />}>
              <Route
                exact
                path='/pipeline'
                element={
                  <PrivateRoute>
                    <Pipeline />
                  </PrivateRoute>
                }
              />{' '}
              <Route
                exact
                path='/pipeline/lead-detail/update/:id'
                element={
                  <PrivateRoute>
                    <LeadDetailEditPipeline />
                  </PrivateRoute>
                }
              />{' '}
              <Route
                exact
                path={'/pipeline/:id/note'}
                element={
                  <PrivateRoute>
                    <Notes type='Pipeline' />
                  </PrivateRoute>
                }
              />
              <Route
                exact
                path={'/pipeline/:id/overview'}
                element={
                  <PrivateRoute>
                    <PipelineOverview />
                  </PrivateRoute>
                }
              />
              <Route
                exact
                path={'/pipeline/:id/task'}
                element={
                  <PrivateRoute>
                    <Tasks type='Pipeline' />
                  </PrivateRoute>
                }
              />
              <Route
                exact
                path={'/pipeline/:id/meeting'}
                element={
                  <PrivateRoute>
                    <Meetings type='Pipeline' />
                  </PrivateRoute>
                }
              />
              <Route
                exact
                path={'/pipeline/:id/call-information'}
                element={
                  <PrivateRoute>
                    <Calls type='Pipeline' />
                  </PrivateRoute>
                }
              />
              <Route
                exact
                path={'/pipeline/:id/lead-detail'}
                element={
                  <PrivateRoute>
                    <LeadDetailsComponent type='Pipeline' />
                  </PrivateRoute>
                }
              />
              <Route
                exact
                path='/pipeline/list'
                element={
                  <PrivateRoute>
                    <BoardPipeline />
                  </PrivateRoute>
                }
              >
                {' '}
              </Route>
              <Route
                exact
                path='/pipeline/create/:createId?'
                element={
                  <PrivateRoute>
                    <CreatePipeline />
                  </PrivateRoute>
                }
              />{' '}
              <Route
                exact
                path='/pipeline/update/:id'
                element={
                  <PrivateRoute>
                    <UpdatePipeline />
                  </PrivateRoute>
                }
              />
            </Route>
            {/* potential routes==== */}
            <Route element={<AppLayout title='Potentials' />}>
              <Route
                exact
                path={'/potential/:id/note'}
                element={
                  <PrivateRoute>
                    <Notes type='Potential' />
                  </PrivateRoute>
                }
              />
              <Route
                exact
                path={'/potential/:id/overview'}
                element={
                  <PrivateRoute>
                    <PotentialOverview />
                  </PrivateRoute>
                }
              />
              <Route
                exact
                path={'/potential/:id/task'}
                element={
                  <PrivateRoute>
                    <Tasks type='Potential' />
                  </PrivateRoute>
                }
              />
              <Route
                exact
                path={'/potential/:id/meeting'}
                element={
                  <PrivateRoute>
                    <Meetings type='Potential' />
                  </PrivateRoute>
                }
              />
              <Route
                exact
                path={'/potential/:id/call-information'}
                element={
                  <PrivateRoute>
                    <Calls type='Potential' />
                  </PrivateRoute>
                }
              />
              <Route
                exact
                path={'/potential/:id/lead-detail'}
                element={
                  <PrivateRoute>
                    <LeadDetailsComponent type='Potential' />
                  </PrivateRoute>
                }
              />

              <Route>
                <Route
                  exact
                  path='/potential'
                  element={
                    <PrivateRoute>
                      <Potential />
                    </PrivateRoute>
                  }
                />{' '}
                <Route
                  exact
                  path='/potential/lead-detail/update/:id'
                  element={
                    <PrivateRoute>
                      <LeadDetailEditPotential />
                    </PrivateRoute>
                  }
                />{' '}
                <Route
                  exact
                  path='/potential/create/:createId?'
                  element={
                    <PrivateRoute>
                      <CreatePotential />
                    </PrivateRoute>
                  }
                />{' '}
                <Route
                  exact
                  path='/potential/update/:id'
                  element={
                    <PrivateRoute>
                      <UpdatePotential />
                    </PrivateRoute>
                  }
                />
              </Route>
            </Route>
            {/* ---------- Deals routes--------- */}
            <Route element={<AppLayout title='Deals' />}>
              {/* <Route exact path="/deal/overview/:id" element={<DealsOverview />} /> */}
              <Route
                exact
                path={'/deal/:id/note'}
                element={
                  <PrivateRoute>
                    <Notes type='Deal' />
                  </PrivateRoute>
                }
              />
              <Route
                exact
                path={'/deal/:id/overview'}
                element={
                  <PrivateRoute>
                    <DealOverview />
                  </PrivateRoute>
                }
              />
              <Route
                exact
                path={'/deal/:id/task'}
                element={
                  <PrivateRoute>
                    <Tasks type='Deal' />
                  </PrivateRoute>
                }
              />
              <Route
                exact
                path={'/deal/:id/meeting'}
                element={
                  <PrivateRoute>
                    <Meetings type='Deal' />
                  </PrivateRoute>
                }
              />
              <Route
                exact
                path={'/deal/:id/call-information'}
                element={
                  <PrivateRoute>
                    <Calls type='Deal' />
                  </PrivateRoute>
                }
              />
              <Route
                exact
                path={'/deal/:id/lead-detail'}
                element={
                  <PrivateRoute>
                    <LeadDetailsComponent type='Deal' />
                  </PrivateRoute>
                }
              />
              <Route
                exact
                path='/deal'
                element={
                  <PrivateRoute>
                    <Deals />
                  </PrivateRoute>
                }
              />{' '}
              <Route
                exact
                path='/deal/lead-detail/update/:id'
                element={
                  <PrivateRoute>
                    <LeadDetailEditDeal />
                  </PrivateRoute>
                }
              />{' '}
              <Route
                exact
                path='/deal/create/:createId?'
                element={
                  <PrivateRoute>
                    <CreateDeals />
                  </PrivateRoute>
                }
              />{' '}
              <Route
                exact
                path='/deal/update/:id'
                element={
                  <PrivateRoute>
                    <UpdateDeals />
                  </PrivateRoute>
                }
              />
            </Route>
            {/* Reports routes==== */}
            <Route element={<AppLayout title='Reports' />}>
              <Route
                exact
                path='/reports'
                element={
                  <PrivateRoute>
                    <Report />
                  </PrivateRoute>
                }
              />{' '}
              <Route
                exact
                path='/reports/create'
                element={
                  <PrivateRoute>
                    <CreateReports />
                  </PrivateRoute>
                }
              />{' '}
              <Route
                exact
                path='/reports/update/:id'
                element={
                  <PrivateRoute>
                    <UpdateReports />
                  </PrivateRoute>
                }
              />{' '}
              <Route
                exact
                path='/reports/:id/:module'
                element={
                  <PrivateRoute>
                    <ListReports />
                  </PrivateRoute>
                }
              />{' '}
            </Route>
            {/* Lostlead routes */}
            <Route element={<AppLayout title='Lost Leads' />}>
              {' '}
              <Route
                exact
                path='/lost-lead'
                element={
                  <PrivateRoute>
                    <LostLists />
                  </PrivateRoute>
                }
              />{' '}
              <Route
                exact
                path={'/lost-lead/:id/note'}
                element={
                  <PrivateRoute>
                    <Notes type='LostLead' />
                  </PrivateRoute>
                }
              />
              <Route
                exact
                path={'/lost-lead/:id/overview'}
                element={
                  <PrivateRoute>
                    <LostOverview />
                  </PrivateRoute>
                }
              />
              <Route
                exact
                path={'/lost-lead/:id/task'}
                element={
                  <PrivateRoute>
                    <Tasks type='LostLead' />
                  </PrivateRoute>
                }
              />
              <Route
                exact
                path={'/lost-lead/:id/meeting'}
                element={
                  <PrivateRoute>
                    <Meetings type='LostLead' />
                  </PrivateRoute>
                }
              />
              <Route
                exact
                path={'/lost-lead/:id/call-information'}
                element={
                  <PrivateRoute>
                    <Calls type='LostLead' />
                  </PrivateRoute>
                }
              />
              <Route
                exact
                path={'/lost-lead/:id/lead-detail'}
                element={
                  <PrivateRoute>
                    <LeadDetailsComponent type='lost_lead' />
                  </PrivateRoute>
                }
              />
            </Route>

            {/* Contact-Lists */}
            <Route element={<AppLayout title="Contact Lists" />}>
              {" "}
              <Route
                exact
                path="/contact-lists"
                element={
                  <PrivateRoute>
                    <ContactList/>
                  </PrivateRoute>
                }
              />{" "}
              </Route>
            <Route element={<AppLayout title="Personal" />}></Route>
            {/* third party routes */}
            <Route element={<AppLayout />}>
              <Route exact path='/third-party' element={<ThirdParty />} />
            </Route>
            <Route element={<AppLayout title='Search Results' />}>
              <Route
                exact
                path='/global-search'
                element={
                  <PrivateRoute>
                    <GlobalSearch />
                  </PrivateRoute>
                }
              ></Route>
            </Route>
            {/* personal route */}
            <Route element={<AppLayout title='Personal' />}>
              <Route
                exact
                path='/account-details/profile-details/:id'
                element={
                  <PrivateRoute>
                    <EditDetails />
                  </PrivateRoute>
                }
              ></Route>
              <Route
                exact
                path='/account/password'
                element={
                  <PrivateRoute>
                    <Password />
                  </PrivateRoute>
                }
              ></Route>
              <Route
                exact
                path='/account-details/profile-details'
                element={
                  <PrivateRoute>
                    <MyAccountDetails />
                  </PrivateRoute>
                }
              />
              <Route
                exact
                path='/account-details/your-company'
                element={
                  <PrivateRoute>
                    <WhiteListDomin />
                  </PrivateRoute>
                }
              />
              <Route
                exact
                path='/subscriptions/current-plan'
                element={
                  <PrivateRoute>
                    <CurrentPlans />
                  </PrivateRoute>
                }
              ></Route>
              <Route
                exact
                path="/account-details/update-currency"
                element={
                  <PrivateRoute>
                    <Currency />
                  </PrivateRoute>
                }
              ></Route>
              <Route
                exact
                path='/subscriptions/transaction-history'
                element={
                  <PrivateRoute>
                    <TransactionHistorys />
                  </PrivateRoute>
                }
              ></Route>
              <Route
                exact
                path='/subscriptions/payment-methods'
                element={
                  <PrivateRoute>
                    <PaymentMethods />
                  </PrivateRoute>
                }
              ></Route>
            </Route>
            {/* company route */}
            <Route element={<AppLayout title='Company' />}>
              <Route
                exact
                path='/roles-permissions/manage-users'
                element={
                  <PrivateRoute>
                    <ManageUsers />
                  </PrivateRoute>
                }
              />
              <Route
                exact
                path='/roles-permissions/hierarchy'
                element={
                  <PrivateRoute>
                    <ManageUsers />
                  </PrivateRoute>
                }
              />
              <Route
                exact
                path='/roles-permissions/data-permission/:id'
                element={
                  <PrivateRoute>
                    <DataPermissionPage />
                  </PrivateRoute>
                }
              />
              <Route
                exact
                path='/roles-permissions/manage-users/user-details/:id'
                element={
                  <PrivateRoute>
                    <UserDetails />
                  </PrivateRoute>
                }
              />
              <Route
                exact
                path='/roles-permissions/manage-users/user-details/update/:id'
                element={
                  <PrivateRoute>
                    <UserOverviewChild />
                  </PrivateRoute>
                }
              />
            </Route>
            <Route element={<AppLayout title='Email Campaigns' />}>
              <Route
                exact
                path='/campaign'
                element={
                  <PrivateRoute>
                    <StartCampaign />
                  </PrivateRoute>
                }
              />
              <Route
                exact
                path='/campaign/create'
                element={
                  <PrivateRoute>
                    <CreateCampaign />
                  </PrivateRoute>
                }
              />
              {/* <Route
                  exact
                  path="/campaign/create"
                  element={
                    <PrivateRoute>
                      <CreateCampaign />
                    </PrivateRoute>
                  }
                /> */}

              <Route
                exact
                path='/campaign/lists'
                element={
                  <PrivateRoute>
                    <Campaigns />
                  </PrivateRoute>
                }
              />
              <Route
                exact
                path='/campaign/templates'
                element={
                  <PrivateRoute>
                    <Templates />
                  </PrivateRoute>
                }
              />
              <Route
                exact
                path='/campaign/drafts'
                element={
                  <PrivateRoute>
                    <Drafts />
                  </PrivateRoute>
                }
              />
              <Route
                exact
                path='/campaign/archive'
                element={
                  <PrivateRoute>
                    <Archive />
                  </PrivateRoute>
                }
              />
              <Route
                exact
                path='/campaign/overview/:id'
                element={
                  <PrivateRoute>
                    <CampaignOverview />
                  </PrivateRoute>
                }
              />
              <Route
                exact
                path='/campaign/overview-list/:id'
                element={
                  <PrivateRoute>
                    <Recipients />
                  </PrivateRoute>
                }
              />
            </Route>
            <Route path='/*' element={<PageNotFound />} />
            <Route path='/status' element={<ServerStatus />} />
            <Route
              exact
              path='/campaign/design/:label?'
              element={
                <PrivateRoute>
                  <EasyEditor />
                </PrivateRoute>
              }
            />
            <Route
              exact
              path='/campaign/preview'
              element={
                <PrivateRoute>
                  <Preview />
                </PrivateRoute>
              }
            />
            <Route
              exact
              path='/campaign/design-2'
              element={
                <PrivateRoute>
                  <DesignTemplate />
                </PrivateRoute>
              }
            />
            <Route
              exact
              path='/campaign/edit-design/:id'
              element={
                <PrivateRoute>
                  <EasyEditor />
                </PrivateRoute>
              }
            />
          </Routes>
        </BrowserRouter>
        {/* </Suspense> */}
      </div>
    </>
  )
}

export default App

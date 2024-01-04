import {
    leadManageState,
    pipelineManageState,
    potentialManageState,
    dealManageState,
    lostLeadManageState,
  } from '../../../Data/ReportManageState'; // Replace with the correct path to your file
  
let leadManageStateData = {
    company_name: 1,
    email: 1,
    phone_number: 1,
    lead_source_id: 1,
    first_name: 1,
    last_name: 1,
    status_id: 1,
    street_address: 1,
    zip_code: 1,
    country: 1,
    city: 1,
    state: 1,
    owner: 1,
  };

  let pipelineManageStateData = {
    first_name: 1,
    account_name: 1,
    last_name: 1,
    email: 1,
    pipeline_score: 1,
    stage: 1,
    phone_number: 1,
    owner: 1,
    expected_revenue: 1,
    company_name: 1,
    next_step: 1,
  };

  let potentialManageStateData = {
    company_name: 1,
    email: 1,
    phone_number: 1,
    lead_source_id: 1,
    first_name: 1,
    last_name: 1,
    owner: 1,
    stage: 1,
    amount: 1,
  };

  let dealManageStateData = {
    company_name: 1,
    email: 1,
    first_name: 1,
    last_name: 1,
    owner: 1,
    sign_off_date: 1,
    value: 1,
    payment_mode: 1,
    tenure: 1,
    deal_terms: 1,
    kick_off_date: 1,
  }

  let lostLeadManageStateData = {
    company: 1,
    email: 1,
    first_name: 1,
    owner: 1,
    phone_number: 1,
    name: 1,
    reason: 1,
  };

  describe('Manage State Objects', () => {
    test('should be an object', () => {
        expect(leadManageState).toBeInstanceOf(Object);
        expect(pipelineManageState).toBeInstanceOf(Object);
        expect(potentialManageState).toBeInstanceOf(Object);
        expect(dealManageState).toBeInstanceOf(Object);
        expect(lostLeadManageState).toBeInstanceOf(Object);
      });

    test('leadManageState should have expected properties', () => {
      expect(leadManageState).toEqual(leadManageStateData);
    });
  
    test('pipelineManageState should have expected properties', () => {
      expect(pipelineManageState).toEqual(pipelineManageStateData);
    });
  
    test('potentialManageState should have expected properties', () => {
      expect(potentialManageState).toEqual(potentialManageStateData);
    });
  
    test('dealManageState should have expected properties', () => {
      expect(dealManageState).toEqual(dealManageStateData);
    });
  
    test('lostLeadManageState should have expected properties', () => {
      expect(lostLeadManageState).toEqual(lostLeadManageStateData);
    });
  });
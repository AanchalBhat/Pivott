import React from "react";
import "@testing-library/jest-dom";
import { LeadAPI } from "../../../apis/LeadApi";

describe("LeadAPI.getFilter", () => {
  const id = 1
  const data = {
    data: {
      lead_source_id: 1,
    },
  };
  const page = 1;
  const pageSize = 10;
  const dropdownCheck = true;
  const type= true;
  const check = true;

  it("should return a promise", () => {
    const promise = LeadAPI.getFilter(data, page, pageSize, dropdownCheck);
    promise.then((Dashboard) => {
        expect(Dashboard).toBePromise();
      });
  });

  it("should return the correct URL with lead_source_id", () => {
    const promise = LeadAPI.getFilter(data, page, pageSize, dropdownCheck);
    promise.then((url) => {
      expect(url).toBe(
        `/leads?date_from=2023-08-01&date_to=2023-08-31&filter_by=created_at&lead_source_id=1`
      );
    });
  });

  it("should return the correct URL with status_id", () => {
    data.data.status_id = [1, 2];
    const promise = LeadAPI.getFilter(data, page, pageSize, dropdownCheck);
    promise.then((url) => {
      expect(url).toBe(
        `/leads?date_from=2023-08-01&date_to=2023-08-31&filter_by=created_at&status_id[]=1&status_id[]=2`
      );
    });
  });

  it("should return the correct URL with industry", () => {
    data.data.industry = "Software";
    const promise = LeadAPI.getFilter(data, page, pageSize, dropdownCheck);
    promise.then((url) => {
      expect(url).toBe(
        `/leads?date_from=2023-08-01&date_to=2023-08-31&filter_by=created_at&industry=Software`
      );
    });
  });

  it("should return the correct URL with company_size", () => {
    data.data.company_size = "10-50";
    const promise = LeadAPI.getFilter(data, page, pageSize, dropdownCheck);
    promise.then((url) => {
      expect(url).toBe(
        `/leads?date_from=2023-08-01&date_to=2023-08-31&filter_by=created_at&company_size=10-50`
      );
    });
  });

  it("should return the correct URL with country", () => {
    data.data.country = "India";
    const promise = LeadAPI.getFilter(data, page, pageSize, dropdownCheck);
    promise.then((url) => {
      expect(url).toBe(
        `/leads?date_from=2023-08-01&date_to=2023-08-31&filter_by=created_at&country=India`
      );
    });
  });

  it("should return the correct URL with city", () => {
    data.data.city = "Bangalore";
    const promise = LeadAPI.getFilter(data, page, pageSize, dropdownCheck);
    promise.then((url) => {
      expect(url).toBe(
        `/leads?date_from=2023-08-01&date_to=2023-08-31&filter_by=created_at&city=Bangalore`
      );
    });
  });

  it("should resolve with a list of leads", () => {
    const promise = LeadAPI.getFilter(data, page, pageSize, dropdownCheck);
    promise.then((leads) => {
      expect(leads).toBeArray();
      expect(leads.length).toBeGreaterThan(0);
    });
  });
  
  it("should resolve with a create of leads", () => {
    const promise = LeadAPI.create(data);
    promise.then((leads) => {
      expect(leads).toBeArray();
      expect(leads.length).toBeGreaterThan(0);
    });
  });

  it("should resolve with a update of leads", () => {
    const promise = LeadAPI.update(data,id);
    promise.then((leads) => {
      expect(leads).toBeArray();
      expect(leads.length).toBeGreaterThan(0);
    });
  });
  
  it("should resolve with a getAll of leads", () => {
    const promise = LeadAPI.getAll(page, pageSize);
    promise.then((leads) => {
      expect(leads).toBeArray();
      expect(leads.length).toBeGreaterThan(0);
    });
  });
  
  it("should resolve with a getManageData of leads", () => {
    const promise = LeadAPI.getManageData(type);
    promise.then((leads) => {
      expect(leads).toBeArray();
      expect(leads.length).toBeGreaterThan(0);
    });
  });
  it("should resolve with a getDropdownFilter of leads", () => {
    
    const promise = LeadAPI.getDropdownFilter(data, page, pageSize, check);
    promise.then((leads) => {
      expect(leads).toBeArray();
      expect(leads.length).toBeGreaterThan(0);
    });
  });
  
  it("should resolve with a getByid of leads", () => {
    const promise = LeadAPI.getByid(id);
    promise.then((leads) => {
      expect(leads).toBeArray();
      expect(leads.length).toBeGreaterThan(0);
    });
  });

  it("should resolve with a getSearchLead of leads", () => {
    const promise = LeadAPI.getSearchLead(data, page, pageSize, check, dropdownCheck);
    promise.then((leads) => {
      expect(leads).toBeArray();
      expect(leads.length).toBeGreaterThan(0);
    });
  });

  it("should resolve with a getSearchLead of leads", () => {
    const promise = LeadAPI.getSearchLead(data, page, pageSize, check, dropdownCheck);
    promise.then((leads) => {
      expect(leads).toBeArray();
      expect(leads.length).toBeGreaterThan(0);
    });
  });

  it("should resolve with a getSearchLead of leads", () => {
    const promise = LeadAPI.getSearchLead(data, page, pageSize, check, dropdownCheck);
    promise.then((leads) => {
      expect(leads).toBeArray();
      expect(leads.length).toBeGreaterThan(0);
    });
  });
})

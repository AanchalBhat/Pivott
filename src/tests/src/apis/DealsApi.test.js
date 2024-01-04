// import { DealsApi } from "./DealsApi";
import React from 'react';
import "@testing-library/jest-dom";
import { DealsApi } from '../../../apis/DealsApi';


const data = {
    data: {
      date_from: "2023-08-01",
      date_to: "2023-08-31",
      filter_by: "created_at",
    },
  };
  const id = 1;
  const company_id = 1;
  const page = 1;
  const pageSize = 10;
  const dropdownCheck = true;
  const check = true;

describe("DealsApi.getFilter", () => {
  it("should return a promise", () => {
    const promise = DealsApi.getFilter(data, page, pageSize, dropdownCheck);
    promise.then((DealsApi) => {
        expect(DealsApi).toBePromise();
      });
  });

  it("should resolve with a list of deals", () => {

    const promise = DealsApi.getFilter(data, page, pageSize, dropdownCheck);
    promise.then((deals) => {
      expect(deals).toBeArray();
      expect(deals.length).toBeGreaterThan(0);
    });
  })

  it("should resolve with a search of deals", () => {
  
    const promise = DealsApi.getDealSearch(data, page,check, pageSize, dropdownCheck);
    promise.then((deals) => {
      expect(deals).toBeArray();
      expect(deals.length).toBeGreaterThan(0);
    });
  })

  it("should resolve with a list of deals", () => {

    const promise = DealsApi.getDropdownFilter(data, page, pageSize);
    promise.then((deals) => {
      expect(deals).toBeArray();
      expect(deals.length).toBeGreaterThan(0);
    });
  })

  it("should resolve with a getReasonData of deals", () => {
 const promise = DealsApi.getReasonData(company_id);
    promise.then((deals) => {
      expect(deals).toBeArray();
      expect(deals.length).toBeGreaterThan(0);
    });
  })

  it("should resolve with a getStageData of deals", () => {
const promise = DealsApi.getStageData(company_id);
    promise.then((deals) => {
      expect(deals).toBeArray();
      expect(deals.length).toBeGreaterThan(0);
    });
  })

  it("should resolve with a update of deals", () => {
    const promise = DealsApi.update(data, id);
    promise.then((deals) => {
      expect(deals).toBeArray();
      expect(deals.length).toBeGreaterThan(0);
    });
  })

  it("should resolve with a getDataById of deals", () => {
    const promise = DealsApi.getDataById(id);
    promise.then((deals) => {
      expect(deals).toBeArray();
      expect(deals.length).toBeGreaterThan(0);
    });
  })

  it("should resolve with a getDataById of deals", () => {
    const promise = DealsApi.getDataById(id);
    promise.then((deals) => {
      expect(deals).toBeArray();
      expect(deals.length).toBeGreaterThan(0);
    });
  })
  it("should resolve with a updateLeadDetialsById of deals", () => {
    const promise = DealsApi.updateLeadDetialsById(id,data);
    promise.then((deals) => {
      expect(deals).toBeArray();
      expect(deals.length).toBeGreaterThan(0);
    });
  })

  it("should resolve with a createContactDetail of deals", () => {
    const promise = DealsApi.createContactDetail(data);
    promise.then((deals) => {
      expect(deals).toBeArray();
      expect(deals.length).toBeGreaterThan(0);
    });
  })
  it("should resolve with a massDelete of deals", () => {
    const promise = DealsApi.massDelete(data);
    promise.then((deals) => {
      expect(deals).toBeArray();
      expect(deals.length).toBeGreaterThan(0);
    });
  })
  it("should resolve with a massConvert of deals", () => {
    const promise = DealsApi.massConvert(data);
    promise.then((deals) => {
      expect(deals).toBeArray();
      expect(deals.length).toBeGreaterThan(0);
    });
  })
  it("should resolve with a potentialWon of deals", () => {
    const promise = DealsApi.potentialWon(data);
    promise.then((deals) => {
      expect(deals).toBeArray();
      expect(deals.length).toBeGreaterThan(0);
    });
  })
  it("should resolve with a getType of deals", () => {
    const promise = DealsApi.getType();
    promise.then((deals) => {
      expect(deals).toBeArray();
      expect(deals.length).toBeGreaterThan(0);
    });
  })
  
  it("should resolve with a getType of deals", () => {
    const promise = DealsApi.getAll(page, pageSize);
    promise.then((deals) => {
      expect(deals).toBeArray();
      expect(deals.length).toBeGreaterThan(0);
    });
  })
  
  it("should resolve with a getType of deals", () => {
    const promise = DealsApi.getPipelineOwnerList();
    promise.then((deals) => {
      expect(deals).toBeArray();
      expect(deals.length).toBeGreaterThan(0);
    });
  })
    
  it("should resolve with a create of deals", () => {
    const promise = DealsApi.create(data);
    promise.then((deals) => {
      expect(deals).toBeArray();
      expect(deals.length).toBeGreaterThan(0);
    });
  })
  
  it("should resolve with a dealMassTransfer of deals", () => {
    const promise = DealsApi.dealMassTransfer(data);
    promise.then((deals) => {
      expect(deals).toBeArray();
      expect(deals.length).toBeGreaterThan(0);
    });
  })

  
});

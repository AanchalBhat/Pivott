import axios from 'axios';
import '@testing-library/jest-dom/extend-expect';
import { callApi } from "../../../apis/callApi";
import { FetchApi } from "../../../apis/fetchApi";

jest.mock("axios", () => {
});

let mockCallData = {
    data: {
        agenda: "",
        assigned_to: 44,
        call_date: "2023-08-30 17:41:34.902Z",
        call_time: "23:11",
        call_to: 43,
        call_type_id: 1,
        callable_id: 66,
        callable_type: "Lead",
        organized_by: 10,
        purpose: "",
        related_to: "deal",
        reminder: "",
        status: "Scheduled",
        subject: "subject test api call 1"
    }
}

let mockDeleteCallData = {
    callable_id: 114,
    callable_type: "Lead"
}

let callResult = {
    data: {
        attributes: {},
        id: "",
        type: "",
    }
}

let deleteCallResult = {
    message: "Record successfully deleted",
    success: true
}

let getCallTypesResult = {
    data: [
        {
            "id": "2",
            "type": "call_type",
            "attributes": {
                "name": "Out-bound"
            }
        },
        {
            "id": "1",
            "type": "call_type",
            "attributes": {
                "name": "In-bound"
            }
        }
    ]
}

let getCallsResult = {
    data: [
        {
            "id": "37",
            "type": "call_information",
            "attributes": {}
        }
    ]
}

jest.mock('../../../apis/fetchApi');

describe('callApi', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should schedule a call with POST request', async () => {
        const body = mockCallData;
        FetchApi.mockResolvedValueOnce(callResult);

        const response = await callApi.scheduleCall(body);

        expect(FetchApi).toHaveBeenCalledWith('/call-informations', 'POST', JSON.stringify({ data: body }));
        expect(response).toEqual(callResult);
    });

    it('should edit a call with PUT request', async () => {
        const id = 36;
        const callable_id = 114;
        const callable_type = "Lead";
        const body = mockCallData;
        FetchApi.mockResolvedValueOnce(callResult);

        const response = await callApi.editCall(id, callable_id, callable_type, body);

        expect(FetchApi).toHaveBeenCalledWith(`/call-informations/${id}?callable_id=${callable_id}&callable_type=${callable_type}`, 'PUT', JSON.stringify({ data: body }));
        expect(response).toEqual(callResult);
    });

    it('should delete a call with DELETE request', async () => {
        const id = 36;
        const callable_id = 114;
        const callable_type = "Lead";
        FetchApi.mockResolvedValueOnce(deleteCallResult);

        const response = await callApi.deleteCall(id, callable_id, callable_type);

        expect(FetchApi).toHaveBeenCalledWith(`/call-informations/${id}?callable_id=${callable_id}&callable_type=${callable_type}`, 'DELETE');
        expect(response).toEqual(deleteCallResult);
    });

    it('should get call types with GET request', async () => {
        const mockResponse = { data: ['In-bound', 'Out-bound'] };
        FetchApi.mockResolvedValue(getCallTypesResult);
        const response = await callApi.getCallTypes();

        expect(FetchApi).toHaveBeenCalledWith('/call_types', 'GET');
        expect(response).toEqual(getCallTypesResult);
    });

    it('should get calls with GET request', async () => {
        const id = 38;
        const type = "Lead";
        const page = 1;
        const pageSize = 10;

        FetchApi.mockResolvedValueOnce(getCallsResult);
        const response = await callApi.getCalls(id, type, page, pageSize);

        expect(FetchApi).toHaveBeenCalledWith(`/call-informations?search[callable_id]=${id}&search[callable_type]=${type}&page=${page}&per_page=${pageSize}`, 'GET');
        expect(response).toEqual(getCallsResult);
    });

    it('should handle errors from FetchApi', async () => {
        const errorMessage = 'An error occurred';
        FetchApi.mockRejectedValue(new Error(errorMessage));

        await expect(callApi.getCallTypes()).rejects.toThrow(errorMessage);
    });

});
import { TaskAPI } from '../../../apis/TaskApi';
import { TASKS } from '../../../constants/routes';
import { FetchApi } from '../../../apis/fetchApi';

jest.mock('../../../apis/fetchApi', () => ({
    FetchApi: jest.fn(),
}));

let taskData = {
    due_date_time: "",
    priority: "high",
    reminder: false,
    repeat: "",
    send_email: false,
    status: "started",
    subject: "sdfs",
    taskable_id: 65,
    taskable_type: "Lead"
}

let taskResult = {
    data: {
        attributes: {},
        id: "11",
        type: "task"
    }
}

let deleteResult = {
    message: "Record successfully deleted",
    success: true
}

describe('TaskAPI', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('create task', async () => {
        FetchApi.mockResolvedValueOnce(taskResult);
        const response = await TaskAPI.create(taskData);
        expect(FetchApi).toHaveBeenCalledWith(TASKS, 'POST', JSON.stringify(taskData));
        expect(response).toEqual(taskResult);
    });

    it('getAll call', async () => {
        FetchApi.mockResolvedValueOnce({});
        const response = await TaskAPI.getAll();
        expect(FetchApi).toHaveBeenCalledWith(TASKS, 'GET');
        expect(response).toEqual({})
    });

    it('edit call', async () => {
        const id = 123;
        const type = 'exampleType';
        const taskable_id = 456;
        const data = { taskName: 'Updated Task' };
        const expectedURL = `${TASKS}/${id}?taskable_type=${type}&taskable_id=${taskable_id}`;
        FetchApi.mockResolvedValueOnce(taskResult);
        const response = await TaskAPI.update(id, type, taskable_id, data);
        expect(FetchApi).toHaveBeenCalledWith(expectedURL, 'PUT', JSON.stringify(data));
        expect(response).toEqual(taskResult);
    });

      it('delete should call FetchApi with the correct URL and method', async () => {
        const id = 123;
        const task_id = 456;
        const type = 'exampleType';
        const expectedURL = `${TASKS}/${id}?taskable_type=${type}&taskable_id=${task_id}`;
        FetchApi.mockResolvedValueOnce(deleteResult);
        const response = await TaskAPI.delete(id, task_id, type);
        expect(FetchApi).toHaveBeenCalledWith(expectedURL, 'DELETE');
        expect(response).toEqual(deleteResult);
      });

    it('getAllId should call FetchApi with the correct URL, method, and parameters', async () => {
        const id = 123;
        const type = 'Lead';
        const status = 'open';
        const page = 1;
        const pageSize = 10;
        const expectedURL = `${TASKS}/?search[taskable_id]=${id}&search[taskable_type]=${type}&search[status]=${status}&page=${page}&per_page=${pageSize}`;
        FetchApi.mockResolvedValueOnce(taskResult);
        const response = await TaskAPI.getAllId(id, type, status, page, pageSize);
        expect(FetchApi).toHaveBeenCalledWith(expectedURL, 'GET');
        expect(response).toEqual(taskResult);
    });

    it('should handle errors from FetchApi', async () => {
        const errorMessage = 'An error occurred';
        FetchApi.mockRejectedValue(new Error(errorMessage));

        await expect(TaskAPI.getAll()).rejects.toThrow(errorMessage);
    });
});
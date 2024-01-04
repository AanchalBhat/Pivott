import { Router } from "react-router-dom";
import { screen, render, cleanup} from "@testing-library/react";
import Dialog from "@mui/material/Dialog";
import "@testing-library/jest-dom";
import { createMemoryHistory } from "history";
import userEvent from "@testing-library/user-event";
import CreateFolder from "../../pages/common/CreateFolder";
jest.mock("axios", () => {
  const axios = jest.fn().mockResolvedValue();
  return axios;
});



describe("Testing Create Folder Component", () => {
  const history = createMemoryHistory();

  afterEach(cleanup);
  beforeEach(() => {
    render(
      <Router location={history.location} navigator={history}>
        <CreateFolder  openLT={true}  />
      </Router>
    );
  });

test("Testing text",() =>{
    expect(screen.getByLabelText(/Create Folder/i)).toBeInTheDocument()
    expect(screen.getByText(/Folder Name/i)).toBeInTheDocument()

})

test("Testing Folder Name field" ,async () =>{
    const folderName=screen.getByTestId("folder-name").querySelector("input")
    expect(folderName).toBeInTheDocument()
    await userEvent.type(folderName,"new folder")
    expect(folderName).toHaveValue("new folder")
})
test("Testing Save and cancel buttons",async () =>{
    const save=screen.getByTestId("save-btn")
    expect(save).toBeInTheDocument()
})
});

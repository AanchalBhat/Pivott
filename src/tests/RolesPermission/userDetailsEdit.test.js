import { Router } from "react-router-dom";
import axios from "axios";
import { screen, render, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import { createMemoryHistory } from "history";
import userEvent from "@testing-library/user-event";
import UserDetailsEdit from "../../pages/RolesPermissions/UserDetails/UserDetailsEdit";

describe("Testing Edit User Details Component", () => {
  const history = createMemoryHistory();
  afterEach(cleanup);
  beforeEach(() => {
    render(
      <Router location={history.location} navigator={history}>
        <UserDetailsEdit />
      </Router>
    );
  });
  test("Test if headings exists or not ", () => {
    expect(screen.getByTestId("details")).toBeInTheDocument();
    expect(screen.getByText(/Max Size 2MB Formats/i)).toBeInTheDocument();
    expect(screen.getByText(/Address/i)).toBeInTheDocument();
  });
  test("Testing upload image button", async () => {
    const picBtn = screen.getByTestId("change-pic");
    expect(picBtn).toBeInTheDocument();
    await userEvent.click(picBtn);
  });
  test("If user can upload a image or not", async () => {
    const testImageFile = new File(["hello"], "hello.png", {
      type: "image/png",
    });
    const inputpic = screen.getByTestId("change-pic");
    expect(inputpic).toBeInTheDocument();
    await userEvent.upload(inputpic, testImageFile);
    //Before image upload, img element won't exist
    //After image upload ,img element will exist
    const img = screen.getByTestId("img");
    expect(img).toBeInTheDocument();
  });
  test("Testing activate user button", async () => {
    const activateButton = screen.getByTestId("activate-btn");
    expect(activateButton).toBeInTheDocument();
    await userEvent.click(activateButton);
  });
  test("Testing Delete User button", async () => {
    const deleteBtn = screen.getByTestId("delete-btn");
    expect(deleteBtn).toBeInTheDocument();
    await userEvent.click(deleteBtn);
  });

  test("Testing if user can type into firstname field or not", async () => {
    const fName = screen.getByTestId("fname").querySelector("input");
    expect(fName).toBeInTheDocument();
    await userEvent.type(fName, "Ram");
    expect(fName).toHaveValue("Ram");
  });
  test("Testing If User can type into phone field or not", async () => {
    const phone = screen.getByTestId("phone");
    expect(phone).toBeInTheDocument();
    await userEvent.type(phone, "98764-42451");
    expect(phone).toHaveValue("+91 98764-42451");
  });
  test("Testing if user can type into lastname field or not", async () => {
    const lName = screen.getByTestId("lname").querySelector("input");
    expect(lName).toBeInTheDocument();
    await userEvent.type(lName, "shah");
    expect(lName).toHaveValue("shah");
  });
  test("Testing if user can type in the website or not ", async () => {
    const website = screen.getByTestId("website-1").querySelector("input");
    expect(website).toBeInTheDocument();
    await userEvent.type(website, "www.protonshub.com");
    expect(website).toHaveValue("www.protonshub.com");
  });
  test("Testing if user can type into fax field or not", async () => {
    const fax = screen.getByTestId("fax-id").querySelector("input");
    expect(fax).toBeInTheDocument();
    await userEvent.type(fax, "442111");
    expect(fax).toHaveValue("442111");
  });

  test("Testing if user can type into mobile field", async () => {
    const mobile = screen.getByTestId("mobile").querySelector("input");
    expect(mobile).toBeInTheDocument();
    await userEvent.type(mobile, "986678998");
    expect(mobile).toHaveValue("986678998");
  });
  test("Testing is user can type into street field",async () =>{
    const street=screen.getByTestId("street").querySelector("input")
    expect(street).toBeInTheDocument()
    await userEvent.type(street,"karol bagh")
    expect(street).toHaveValue("karol bagh")
  })
  test("Testing is user can type into zip field",async () =>{
        const zip=screen.getByTestId("zip").querySelector("input")
        expect(zip).toBeInTheDocument()
        await userEvent.type(zip,"876661")
        expect(zip).toHaveValue("876661")
  })
  test("Testing Save Button",async () =>{
    const saveBtn=screen.getByTestId("save-btn")
    expect(saveBtn).toBeInTheDocument()
    await userEvent.click(saveBtn)

  })
  test("Testing cancel button",async () =>{
        const cancelBtn=screen.getByTestId('cancel-btn')
        expect(cancelBtn).toBeInTheDocument()
        await userEvent.click(cancelBtn)
  })
});

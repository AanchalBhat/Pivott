import { Router } from "react-router-dom";
import { screen, render, cleanup} from "@testing-library/react";
import Createlead from "../../components/Leads/CreateLeads";
import "@testing-library/jest-dom";
import { createMemoryHistory } from "history";
import userEvent from "@testing-library/user-event";
// jest.mock("axios", () => {});
describe("Testing CreateLead Component", () => {
  const history = createMemoryHistory();
  afterEach(cleanup);
  beforeEach(() => {
    render(
      <Router location={history.location} navigator={history}>
        <Createlead />
      </Router>
    );
  });

  test("Testing  Text on screen",() =>{
    expect(screen.getByText(/Details/i)).toBeInTheDocument()
    expect(screen.getByText(/Max Size 2MB Formats/i)).toBeInTheDocument()
    expect(screen.getByText(/Address/i)).toBeInTheDocument()
  })
  test("Testing upload image button",async () =>{
    const picBtn=screen.getByTestId("pic-btn")
    expect(picBtn).toBeInTheDocument()
    await userEvent.click(picBtn)
   })
  test("If user can upload a image or not",async () =>{
    const testImageFile = new File(["hello"], "hello.png", {
      type: "image/png",
    });
    const inputpic=screen.getByTestId("change-pic")
    expect(inputpic).toBeInTheDocument()
    await userEvent.upload(inputpic,testImageFile)
    //Before image upload, img element won't exist
    //After image upload ,img element will exist
    const img=screen.getByTestId("img")
    expect(img).toBeInTheDocument()

  })
  test('Testing Arrow button',async () =>{
    const arrowbtn=screen.getByTestId("arrow-btn")
    expect(arrowbtn).toBeInTheDocument()
    await userEvent.click(arrowbtn)
  })
  test("Testing input firstname field",async () =>{
    const fname=screen.getByTestId("first_name").querySelector("input")
    expect(fname).toBeInTheDocument()
    await  userEvent.type(fname,"Ram")
    expect(fname).toHaveValue("Ram")
  })
  test("Testing lastname field ",async() =>{
    const lname=screen.getByTestId("last_name").querySelector("input")
    expect(lname).toBeInTheDocument()
    await userEvent.type(lname,"shah")
    expect(lname).toHaveValue('shah')
  })
  test('Testing Email field',async () =>{
    const email=screen.getByTestId("email").querySelector("input")
    expect(email).toBeInTheDocument()
    await userEvent.type(email,"crpp@gmail.com")
    expect(email).toHaveValue("crpp@gmail.com")
  })
  test("Testing Contact field",async () =>{
    const contact =screen.getByTestId("contact")
    expect(contact).toBeInTheDocument()
    await userEvent.type(contact,"98765-89076")
    expect(contact).toHaveValue("+91 98765-89076")
  })
  test('Testing Company Name field',async () =>{
    const company=screen.getByTestId("company_name").querySelector("input")
    expect(company).toBeInTheDocument()
    await userEvent.type(company,"google")
    expect(company).toHaveValue('google')
  })
  test("Testing lead source,lead status field",() =>{
    const leadSource=screen.getByTestId("lead_source")
    expect(leadSource).toBeInTheDocument()
    const leadStatus=screen.getByTestId("lead_status")
    expect(leadStatus).toBeInTheDocument()
  })
  test("Testing website input field",async () =>{
    const website=screen.getByTestId("website").querySelector("input")
    expect(website).toBeInTheDocument()
    await userEvent.type(website,"crcc@123gmail.com")
    expect(website).toHaveValue("crcc@123gmail.com")
  })

test("Testing designation input field",async () =>{
  const designation=screen.getByTestId("designation").querySelector("input")
  expect(designation).toBeInTheDocument()
  await userEvent.type(designation,'ceo')
  expect(designation).toHaveValue("ceo")
})
test("Testing street input field",async () =>{
  const street=screen.getByTestId("street_address").querySelector("input")
  expect(street).toBeInTheDocument()
  await userEvent.type(street,"Karol Bagh")
  expect(street).toHaveValue("Karol Bagh")
})
test("Testing zip_code input field", async () => {
  const zip_code = screen.getByTestId("zip_code").querySelector("input")
  expect(zip_code).toBeInTheDocument();
})
test("Testing save and cancel buttons",async () =>{
  const saveButton=screen.getByTestId("save-btn")
  expect(saveButton).toBeInTheDocument()
  const cancelButton=screen.getByTestId("cancel-btn")
  expect(cancelButton).toBeInTheDocument()
  await userEvent.click(saveButton)
  await userEvent.click(cancelButton)
})
});

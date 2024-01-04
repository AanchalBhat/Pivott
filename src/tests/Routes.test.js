import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import "@testing-library/jest-dom";
import Login from "../pages/Login/Login";
import Signup from "../pages/Signup/Signup";
import AccountActivation from "../pages/VerifyEmail/VerifyEmail";
import ForgotPassword from "../pages/AccountActivation/ForgotPassword";
import PasswordResetSuccess from "../pages/AccountActivation/PasswordResetSuccess";


describe("Testing all Routes in the app", () => {
  function wrapper({ children }) {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    return (
      <MemoryRouter initialEntries={["/"]}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </MemoryRouter>
    );
  }

  test("Testing Login Route", async () => {
    render(
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>,
      { wrapper }
    );
    expect(screen.getByTestId("login")).toBeInTheDocument();

    const email = screen.getByTestId("email-input").querySelector("input");
    email.defaultValue = "aanchal.bhat@protonshub.in";
    expect(email).toHaveValue("aanchal.bhat@protonshub.in");
    const password = screen
      .getByTestId("password-input")
      .querySelector("input");
    password.defaultValue = "Anshul@96";
    expect(password).toHaveValue("Anshul@96");
  });
});

describe("Testing Signup Component", () => {
  function wrapper({ children }) {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    return (
      <MemoryRouter initialEntries={["/signup"]}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </MemoryRouter>
    );
  }

  test('Testing Sign Up component on route  "/signup" ', async () => {
    render(
      <Routes>
        <Route path="/signup" element={<Signup />} />
      </Routes>,
      { wrapper }
    );

    expect(screen.getByTestId("sig")).toBeInTheDocument();
  });
});

describe("Testing verify-email  Component", () => {
  function wrapper({ children }) {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    return (
      <MemoryRouter initialEntries={["/verify-email"]}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </MemoryRouter>
    );
  }

  test('Testing verifyEmail component on route  "/verify-email" ', async () => {
    render(
      <Routes>
        <Route path="/verify-email" element={<AccountActivation />} />
      </Routes>,
      { wrapper }
    );

    expect(screen.getByTestId("verify-btn")).toBeInTheDocument();
    expect(screen.getByText(/Verify your email address/i)).toBeInTheDocument();
    const otp = screen.getByTestId("otp");
    otp.value = "2345";
    expect(otp).toHaveValue("2345");
  });
});

describe("Testing ForgotPassword Component", () => {
  function wrapper({ children }) {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    return (
      <MemoryRouter initialEntries={["/forgot-password"]}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </MemoryRouter>
    );
  }

  test('Testing forgotPassword component on route  "/forgot-password" ', async () => {
    render(
      <Routes>
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>,
      { wrapper }
    );


    expect(screen.getByText(/Reset Password/i)).toBeInTheDocument();
    expect(
      screen.getByText(
        /Enter your email ID to get reset link to your email address/i
      )
    ).toBeInTheDocument();
    const email = screen.getByTestId("mail");
    email.value = "aj123@gmail.com";
    expect(email).toHaveValue("aj123@gmail.com");
  });
});

describe("Testing Password Reset Success Component", () => {
  function wrapper({ children }) {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    return (
      <MemoryRouter initialEntries={["/password-reset-success"]}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </MemoryRouter>
    );
  }

  test('Testing PasswordReset success component on route  "/password-reset-success" ', async () => {
    render(
      <Routes>
        <Route
          path="/password-reset-success"
          element={<PasswordResetSuccess />}
        />
      </Routes>,
      { wrapper }
    );


    expect(screen.getByTestId("success")).toBeInTheDocument();
    expect(screen.getByTestId("success-btn")).toBeInTheDocument();
  });
});

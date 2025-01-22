import { act, render, screen, fireEvent } from '@testing-library/react'
import LoginForm from '../LoginForm'
import { signIn } from 'next-auth/react';
import userEvent from '@testing-library/user-event';

const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockGet = jest.fn();
const mockPathname = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    push: mockPush,
    replace: mockReplace,
    prefetch: jest.fn(),
    pathname: mockPathname,
  })),
  useSearchParams: jest.fn(() => ({
    get: mockGet,
  })),
}));

global.fetch = jest.fn(() => {
    Promise.resolve({
        ok: true,
        status: 200
    })
})

jest.mock("next-auth/react")

describe('LoginForm', () => {
    beforeEach(() => {
        jest.clearAllMocks();
      });
    describe('Render', () => {
        it('renders email and password inputs', () => {

            render(<LoginForm />)

            const emailInput = screen.getByTestId('email')
            const passwordInput = screen.getByTestId('password')
            const submitButton = screen.getByText('Login')
            const goBackButton = screen.getByText('Volver')

            expect(emailInput).toBeInTheDocument()
            expect(passwordInput).toBeInTheDocument()
            expect(submitButton).toBeInTheDocument()
            expect(goBackButton).toBeInTheDocument()
        })

    })
    describe('Behaviour', () => {
        beforeEach(() => {
            jest.useFakeTimers()
        })
        
        afterEach(() => {
            jest.useRealTimers()
        })
        it('input value changes when user updates "email" and "password" inputs', () => {

            render(<LoginForm />)

            const emailInput = screen.getByTestId('email')
            const passwordInput = screen.getByTestId('password')

            act(() => {fireEvent.change(emailInput, { target: { value: "user@example.com" } });
            fireEvent.change(passwordInput, { target: { value: "password123" } });
            })

            expect(emailInput.value).toBe("user@example.com");
            expect(passwordInput.value).toBe("password123");
        })
        it("calls handleLogin when the submit button is clicked", () => {
            signIn.mockResolvedValueOnce({ ok: true, status: 200 });
            mockGet.mockReturnValue(null);
            mockPathname.mockReturnValue("/login");

            render(<LoginForm />);

            const emailInput = screen.getByTestId('email')
            const passwordInput = screen.getByTestId('password')
            const submitButton = screen.getByText('Login')

            act(() => {
                fireEvent.change(emailInput, { target: { value: "user@example.com" } });
                fireEvent.change(passwordInput, { target: { value: "password123" } });
                fireEvent.click(submitButton);
            })

            expect(submitButton).toBeInTheDocument()
            expect(signIn).toHaveBeenCalledWith('credentials', {
          email: "user@example.com", password: "password123", redirect: false
        }) 
          });
        it("calls handleLogin when the submit button is clicked", async () => {
            jest.useFakeTimers();
            signIn.mockResolvedValueOnce({ ok: false, status: 500 });

            const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

            render(<LoginForm />);

            const emailInput = screen.getByTestId('email')
            const passwordInput = screen.getByTestId('password')
            const submitButton = screen.getByText('Login')

            expect(await screen.queryByTestId("snackbar")).not.toBeInTheDocument();

            fireEvent.change(emailInput, { target: { value: "user@example.com" } });
            fireEvent.change(passwordInput, { target: { value: "password123" } });
            await user.click(submitButton);
            expect(await screen.findByTestId("snackbar")).toBeInTheDocument();
            const closeSnackbarButton = screen.getByTitle('Close')
            act(() => (fireEvent.click(closeSnackbarButton)))
            act(() => jest.advanceTimersByTime(5000));

            expect(signIn).toHaveBeenCalledWith('credentials', {
                email: "user@example.com", password: "password123", redirect: false
             })
            expect(await screen.queryByTestId("snackbar")).not.toBeInTheDocument();
          });
          it("calls handleLogin when the submit button is clicked", () => {
            signIn.mockResolvedValueOnce({ ok: true, status: 200 });
            mockGet.mockReturnValue("http://localhost/3000/upload");
            mockPathname.mockReturnValue("http://localhost/3000/upload");

            render(<LoginForm />);

            const emailInput = screen.getByTestId('email')
            const passwordInput = screen.getByTestId('password')
            const submitButton = screen.getByText('Login')

            act(() => {
                fireEvent.change(emailInput, { target: { value: "user@example.com" } });
                fireEvent.change(passwordInput, { target: { value: "password123" } });
                fireEvent.click(submitButton);
            })

            expect(submitButton).toBeInTheDocument()
            expect(signIn).toHaveBeenCalledWith('credentials', {
                email: "user@example.com", password: "password123", redirect: false
            })
            expect(mockGet).toHaveBeenCalledWith('callbackUrl');
          });
    })
})
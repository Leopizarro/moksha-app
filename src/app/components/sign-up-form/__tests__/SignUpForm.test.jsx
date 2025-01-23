import { render, screen, act, fireEvent } from '@testing-library/react';
import SignUpForm from '../SignUpForm';
import { createUser } from "../../../app/create/authActions"

global.fetch = jest.fn(() => {
    Promise.resolve({
        ok: true,
        status: 200
    })
})

jest.mock('../../../app/create/authActions.ts', () => ({
    ...(jest.requireActual('../../../app/create/authActions.ts')),
    createUser: jest.fn()
  }))


describe('Sign Up Form', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Reset mocks before each test
      });
    describe('Render', () => {
        it('renders email and password inputs', () => {

            render(<SignUpForm />)

            const emailInput = screen.getByTestId('email')
            const passwordInput = screen.getByTestId('password')
            const submitButton = screen.getByText('Crear usuario')

            expect(emailInput).toBeInTheDocument()
            expect(passwordInput).toBeInTheDocument()
            expect(submitButton).toBeInTheDocument()
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

            render(<SignUpForm />)

            const emailInput = screen.getByTestId('email')
            const passwordInput = screen.getByTestId('password')

            act(() => {fireEvent.change(emailInput, { target: { value: "user@example.com" } });
            fireEvent.change(passwordInput, { target: { value: "password123" } });
            })

            expect(emailInput.value).toBe("user@example.com");
            expect(passwordInput.value).toBe("password123");
        })
        it("calls createUser when the submit button is clicked", () => {
            createUser.mockReturnValue({ok: true, message: 'ok'})
            render(<SignUpForm />);

            const emailInput = screen.getByTestId('email')
            const passwordInput = screen.getByTestId('password')
            const submitButton = screen.getByText('Crear usuario')

            act(() => {
                fireEvent.change(emailInput, { target: { value: "user@example.com" } });
                fireEvent.change(passwordInput, { target: { value: "password123" } });
                fireEvent.click(submitButton);
            })

            expect(submitButton).toBeInTheDocument()
            expect(createUser).toHaveBeenCalled()
        });
        it("calls createUser when the submit button is clicked", async () => {
            createUser.mockReturnValue({ok: false, message: 'error!'})
            render(<SignUpForm />);

            const emailInput = screen.getByTestId('email')
            const passwordInput = screen.getByTestId('password')
            const submitButton = screen.getByText('Crear usuario')

            act(() => {
                fireEvent.change(emailInput, { target: { value: "user@example.com" } });
                fireEvent.change(passwordInput, { target: { value: "password123" } });
                fireEvent.click(submitButton);
            })

            expect(await screen.findByTestId("snackbar")).toBeInTheDocument();
            const closeSnackbarButton = screen.getByTitle('Close')
            act(() => (fireEvent.click(closeSnackbarButton)))
            act(() => jest.advanceTimersByTime(5000));

            expect(submitButton).toBeInTheDocument()
            expect(createUser).toHaveBeenCalled()
            expect(await screen.queryByTestId("snackbar")).not.toBeInTheDocument();
        });

    })
})
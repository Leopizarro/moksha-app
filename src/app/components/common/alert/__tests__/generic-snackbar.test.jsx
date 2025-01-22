import { act, render, screen, fireEvent, waitFor } from "@testing-library/react";
import GenericSnackbar from '../GenericSnackbar';

describe('Generic Snackbar', () => {
    describe('Render', () => {
        it('renders when "open" is true', () => {
            const handleClose = jest.fn();
            render(<GenericSnackbar open={true} message="generic message" severity="error" handleCloseAlert={handleClose}/>)
            const snackbar = screen.getByText("generic message");
            expect(snackbar).toBeInTheDocument();
        })
        it('does not render when "open" is false', () => {
            const handleClose = jest.fn();
            render(<GenericSnackbar open={false} message="generic message" severity="error" handleCloseAlert={handleClose}/>)
            const snackbar = screen.queryByText("generic message");
            expect(snackbar).not.toBeInTheDocument();
        })
    })
    describe('Behaviour', () => {
        beforeEach(() => {
            jest.useFakeTimers()
        })
        
        afterEach(() => {
            jest.useRealTimers()
        })
        it('closes after the open time expires (5000ms)', async () => {
            const handleClose = jest.fn();
            render(<GenericSnackbar open={true} message="generic message" severity="error" handleCloseAlert={handleClose}/>)
            act(() => jest.advanceTimersByTime(5000));
            expect(handleClose).toHaveBeenCalled();
        })

        it('closes after the user presses the Escape key', () => {
            const handleClose = jest.fn();
            render(<GenericSnackbar open={true} message="generic message" severity="error" handleCloseAlert={handleClose}/>)
            const snackbar = screen.queryByText("generic message");
            fireEvent.keyDown(snackbar,{ key: 'Escape'})
            expect(handleClose).toHaveBeenCalled();
        })
    })
})
import { render, screen,cleanup} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import "@testing-library/jest-dom";
import LostsOverview from "../../pages/LostLeads/Overview";
import LostOverview from "../../components/LostLeads/Overview/Overview";

afterEach(() => {
    cleanup(); 
})

// lost lead overview.js
   describe('Details', () => {
        const history = createMemoryHistory();
        beforeEach(() => {
            render(
                <Router location={history.location} navigator={history}>
                  <LostOverview />
                </Router>
              );

        });
        
      test('check weather Overview is present in overview table' , () => {
        expect(screen.getByText('Overview')).toBeInTheDocument();
      })

      test('check weather Send Email is present in overview table', () => {
        expect(screen.getByText('Send Email')).toBeInTheDocument();
      })

      test('check weather Description is present in overview table', () => {
        expect(screen.getByText('Description')).toBeInTheDocument();
      })

      test('check weather contact mode is present in overview table', () => {
        expect(screen.getByText('Contact made |')).toBeInTheDocument();
      })

      test('check weather Contact Person is present in overview table', () => {
        expect(screen.getByText('Contact Person')).toBeInTheDocument();
      })

      test('check weather Email is present in overview table', () => {
        expect(screen.getByText('Email')).toBeInTheDocument();
      })

      test('check weather Contact Person is present in overview table', () => {
        expect(screen.getByText('Contact')).toBeInTheDocument();
      })
      test('check weather Other Detailsis present in overview table', () => {
        expect(screen.getByText('Other Details')).toBeInTheDocument();
      })
      test('check weather Account Name is present in overview table', () => {
        expect(screen.getByText('Account Name')).toBeInTheDocument();
      })

      test('check weather Amount is present in overview table', () => {
        expect(screen.getByText('Amount')).toBeInTheDocument();
      })

      test('check weather Type is present in overview table', () => {
        expect(screen.getByText('Type')).toBeInTheDocument();
      })

      test('check weather Stage History is present in overview table', () => {
        expect(screen.getByText('Stage History')).toBeInTheDocument();
      })
    })


// lost lead 

describe('lostlead overview functionalities', () => {
    const history = createMemoryHistory();
    beforeEach(() => {
              render(
                <Router location={history.location} navigator={history}>
                  <LostsOverview />
                </Router>
              );
            });

    test('check if arrow btn is present and clickable', () => {
        const button = screen.getByTestId('arrow-back');
        expect(button).toBeInTheDocument();
        userEvent.click(button)
    })

    test('check if send mail btn is present and clickable', () => {
        const button = screen.getByTestId('send-mail-btn');
        expect(button).toBeInTheDocument();
        userEvent.click(button)
    })

    test('check if more btn is present and clickable', () => {
        const button = screen.getByTestId('more-btn');
        expect(button).toBeInTheDocument();
        userEvent.click(button)
    })
})

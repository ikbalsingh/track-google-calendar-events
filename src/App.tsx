import { FC, useEffect, useState } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import { Charts } from './Charts';
import moment from 'moment';

import './style.css';
import { CalendarEvent } from './interface';

const API_KEY = 'AIzaSyDtkGCmNn3QSaaFPfax8HySNbvvVBk7AI8';
const CALENDAR_ID = 'ikbalsinghdhanjal23@gmail.com';

interface LoadingState {
  isLoading: boolean;
  error?: Error;
}

interface Error {
  errorCode?: number;
  errorMsg?: string;
}

export const App: FC<{ name: string }> = ({ name }) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loadingState, setIsLoadingState] = useState<LoadingState>({
    isLoading: false,
  });

  const listTodaysEvents = (gapi) => {
    var today = moment('09/07/2023', 'MM/DD/YYYY');
    var endOfDay = moment();

    gapi.client.calendar.events
      .list({
        calendarId: CALENDAR_ID,
        timeMin: today.toISOString(),
        timeMax: endOfDay.toISOString(),
        singleEvents: true,
        orderBy: 'startTime',
      })
      .then(
        function (response) {
          var events = response.result.items;
          setEvents(events);
        },
        function (error) {
          console.error('Error fetching events: ' + error);
        }
      );
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.async = true;
    script.defer = true;
    setIsLoadingState({
      isLoading: true,
    });
    script.onload = () => {
      try {
        window.gapi.load('client:auth2', () => {
          window.gapi.client
            .init({
              apiKey: API_KEY,
              discoveryDocs: [
                'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
              ],
              scope: 'https://www.googleapis.com/auth/calendar.readonly',
            })
            .then(
              () => {
                setIsLoadingState({
                  isLoading: false,
                });
                listTodaysEvents(window.gapi);
              },
              (error) => {
                setIsLoadingState({
                  isLoading: false,
                  error: {
                    errorMsg: error,
                  },
                });
                console.error(error);
              }
            );
        });
      } catch (err) {
        setIsLoadingState({
          isLoading: false,
          error: {
            errorMsg: err,
          },
        });
      }
    };
    script.onerror = (err) => {
      setIsLoadingState({
        isLoading: false,
        error: {
          errorMsg: err.toString(),
        },
      });
    };
    document.body.appendChild(script);
  }, []);

  return (
    <>
      {loadingState.isLoading ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: '50%',
          }}
        >
          <ClipLoader
            color={'aqua'}
            loading={loadingState.isLoading}
            size={50}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      ) : (
        <Charts events={events} />
      )}
    </>
  );
};

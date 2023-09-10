import { FC, useEffect, useState } from 'react';
import { CalendarEvent } from './interface';
import moment from 'moment';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

import { PointElement, LineElement } from 'chart.js';
import { Line } from 'react-chartjs-2';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
);

interface ICharts {
  events: CalendarEvent[];
}

export const Charts: FC<ICharts> = ({ events }) => {
  const barOptions = {
    plugins: {
      title: {
        display: true,
        text: 'Daily Events',
      },
    },
    responsive: true,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Daily events',
      },
    },
  };

  const trackableEvents = events.filter((ev) =>
    ev.summary?.toLowerCase().includes('track:')
  );

  const eventDateMap = trackableEvents.reduce((acc, ev) => {
    const startDate = moment(ev.start.dateTime);
    const endDate = moment(ev.end.dateTime);
    const hasFailed = ev.summary.toLowerCase().includes('failed:');
    if (acc[startDate.format('MM/DD/YYYY')]) {
      acc[startDate.format('MM/DD/YYYY')][
        hasFailed ? 'failed' : 'success'
      ].push(ev);
    } else {
      acc[startDate.format('MM/DD/YYYY')] = {
        failed: hasFailed ? [ev] : [],
        success: !hasFailed ? [ev] : [],
      };
    }
    if (acc[endDate.format('MM/DD/YYYY')]) {
      acc[endDate.format('MM/DD/YYYY')][hasFailed ? 'failed' : 'success'].push(
        ev
      );
    } else {
      acc[endDate.format('MM/DD/YYYY')] = {
        failed: hasFailed ? [ev] : [],
        success: !hasFailed ? [ev] : [],
      };
    }
    return acc;
  }, {});

  console.log(eventDateMap);

  const barChartData = {
    labels: Object.keys(eventDateMap),
    datasets: [
      {
        label: 'Success',
        data: Object.values(eventDateMap).map(
          (x: { success: unknown[]; failed: unknown[] }) => x.success.length
        ),
        backgroundColor: 'rgb(255, 99, 132)',
      },
      {
        label: 'Failed',
        data: Object.values(eventDateMap).map(
          (x: { success: unknown[]; failed: unknown[] }) => x.failed.length
        ),
        backgroundColor: 'rgb(75, 192, 192)',
      },
    ],
  };

  const lineChartData = {
    labels: Object.keys(eventDateMap),
    datasets: [
      {
        label: 'Success',
        data: Object.values(eventDateMap).map(
          (x: { success: unknown[]; failed: unknown[] }) => x.success.length
        ),
        backgroundColor: 'rgb(255, 99, 132)',
      },
      {
        label: 'Failed',
        data: Object.values(eventDateMap).map(
          (x: { success: unknown[]; failed: unknown[] }) => x.failed.length
        ),
        backgroundColor: 'rgb(75, 192, 192)',
      },
    ],
  };

  const lineChartRatioData = {
    labels: Object.keys(eventDateMap),
    datasets: [
      {
        label: 'Success',
        data: Object.values(eventDateMap).map(
          (x: { success: unknown[]; failed: unknown[] }) =>
            x.success.length / (x.success.length + x.failed.length)
        ),
        backgroundColor: 'rgb(255, 99, 132)',
      },
      {
        label: 'Failed',
        data: Object.values(eventDateMap).map(
          (x: { success: unknown[]; failed: unknown[] }) =>
            x.failed.length / (x.success.length + x.failed.length)
        ),
        backgroundColor: 'rgb(75, 192, 192)',
      },
    ],
  };

  const groupFailedEvents = Object.values(eventDateMap).reduce(
    (
      acc,
      currentValue: { success: CalendarEvent[]; failed: CalendarEvent[] }
    ) => {
      currentValue.failed.forEach((ev) => {
        if (acc[ev.recurringEventId]) {
          acc[ev.recurringEventId].push(ev);
        } else {
          acc[ev.recurringEventId] = [ev];
        }
      });
      return acc;
    },
    {}
  );

  const firstThreeSortedFailedEventSummaries = Object.values(groupFailedEvents)
    .sort((a, b) => a.length - b.length)
    .map((x) => x[0].summary)
    .splice(0, 3);
  console.log(firstThreeSortedFailedEventSummaries);

  return (
    <>
      <div style={{ display: 'flex' }}>
        <div style={{ width: '50%' }}>
          <Bar options={barOptions} data={barChartData} />
        </div>
        <div style={{ width: '50%' }}>
          <Line options={lineOptions} data={lineChartData} />
        </div>
      </div>
      <div style={{ display: 'flex' }}>
        <div style={{ width: '50%' }}>
          <Line options={lineOptions} data={lineChartRatioData} />
        </div>
        <div
          style={{
            width: '50%',
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography variant="h5" component="div">
                Top 3 failed events
              </Typography>
              <List>
                {firstThreeSortedFailedEventSummaries.map((eventSummary) => (
                  <ListItem disablePadding>
                    <ListItemButton>
                      <ListItemText primary={eventSummary} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

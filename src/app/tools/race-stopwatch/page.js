'use client';
import React, { useEffect, useRef, useReducer } from 'react';
import styles from './page.module.css';
import Button from '@/Components/Button';
import { FaStopwatch } from 'react-icons/fa';
const abbreviations = {
  meters: 'm',
  miles: 'mi',
  kilometers: 'km',
};
let time = 0;
// const initialState = {
//   active: true,
//   time: 0,
//   running: false,
//   distance: 5000,
//   split: 1600,
//   runners: [{ name: 'Trevor Cash', splits: [] }],
//   activeRunner: 0,
// };
const initialState = {
  active: false,
  time: 0,
  running: false,
  distance: undefined,
  split: undefined,
  unit: 'meters',
  runners: [{ name: '', splits: [] }],
  activeRunner: 0,
};
function reducer(state, action) {
  const runners = state.runners;
  switch (action.type) {
    case 'toggleRunning':
      return { ...state, running: !state.running };
    case 'updateTime':
      return { ...state, time: action.time };
    case 'reset':
      window.gtag &&
        window.gtag('event', 'reset', {
          tool: 'Race Stopwatch',
          event_category: 'timer',
        });
      time = 0;
      action.timer.textContent = '00:00.00';
      return {
        ...state,
        runners: state.runners.map((runner, index) => {
          return { ...runner, splits: [] };
        }),
      };
    case 'setDistance':
      return { ...state, distance: action.distance };
    case 'setSplit':
      window.gtag &&
        window.gtag('event', 'set_split', {
          tool: 'Race Stopwatch',
          event_category: 'timer',
        });
      return { ...state, split: action.split };
    case 'clearSplit':
      window.gtag &&
        window.gtag('event', 'clear_split', {
          tool: 'Race Stopwatch',
          event_category: 'timer',
        });
      runners[state.activeRunner].splits.splice(action.index, 1);
      return {
        ...state,
        runners: runners,
      };
    case 'addRunnerSplit':
      window.gtag &&
        window.gtag('event', 'split', {
          tool: 'Race Stopwatch',
          event_category: 'timer',
        });
      runners[state.activeRunner].splits.push(time);
      return {
        ...state,
        runners: runners,
      };
    case 'addRunner':
      window.gtag &&
        window.gtag('event', 'reset', {
          tool: 'Race Stopwatch',
          event_category: 'set_up',
        });
      return {
        ...state,
        runners: [...state.runners, { name: '', splits: [] }],
      };
    case 'removeRunner':
      return {
        ...state,
        runners: state.runners.filter((_, index) => index !== action.index),
      };
    case 'editRunner':
      return {
        ...state,
        runners: state.runners.map((runner, index) => {
          if (index === action.index) {
            return { ...runner, ...action.runner };
          }
          return runner;
        }),
      };
    case 'setActiveRunner':
      window.gtag &&
        window.gtag('event', 'change_runner', {
          tool: 'Race Stopwatch',
          event_category: 'timer',
        });
      return {
        ...state,
        activeRunner: action.index,
      };
    case 'toggleActive':
      return {
        ...state,
        active: !state.active,
        runners: runners.filter((runner) => !!runner.name.length),
      };
    case 'setUnit':
      window.gtag &&
        window.gtag('set', {
          tool: 'Race Stopwatch',
          unit: action.unit,
        });
      return {
        ...state,
        unit: action.unit,
      };
    default:
      throw new Error();
  }
}

export default function Stopwatch() {
  const timeContainer = useRef(null);
  const [state, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    if (state.running) {
      const start = Date.now();
      const current = time;
      const timer = setInterval(() => {
        time = Date.now() - start + current;
        if (timeContainer.current) {
          timeContainer.current.innerHTML = formatTime(time);
        }
      }, 10);
      return () => {
        clearInterval(timer);
      };
    }
  }, [state.running]);

  function formatTime(time) {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time - minutes * 60000) / 1000);
    const milliseconds = Math.floor(time - minutes * 60000 - seconds * 1000);
    const millisecondsWithoutThousands = Math.floor(milliseconds / 10);
    return `${padZero(minutes)}:${padZero(seconds)}.${padZero(
      millisecondsWithoutThousands
    )}`;
  }

  function padZero(number) {
    return number < 10 ? `0${number}` : number;
  }

  return (
    <div className={styles.wrapper}>
      {!state.active ? (
        <>
          <h1 className={styles.Heading}>
            {' '}
            <FaStopwatch /> Race Stopwatch
          </h1>
          <form
            className={styles.form}
            onSubmit={(e) => {
              e.preventDefault();
              dispatch({ type: 'toggleActive' });
            }}
          >
            <label className={styles.label}>
              <span className={styles.labelText}>Distance</span>
              <input
                className={styles.input}
                type='number'
                placeholder='5000'
                required
                value={state.distance}
                onChange={(e) => {
                  dispatch({ type: 'setDistance', distance: e.target.value });
                }}
              />
              <span>{state.unit}</span>
            </label>
            <label className={styles.label}>
              <span className={styles.labelText}>Splits</span>
              <input
                className={styles.input}
                type='number'
                placeholder='1600'
                required
                value={state.split}
                onChange={(e) => {
                  dispatch({ type: 'setSplit', split: e.target.value });
                }}
              />
              <span>{state.unit}</span>
            </label>
            <label className={styles.label}>
              <span className={styles.labelText}>Unit</span>
              <select
                onChange={(e) => {
                  dispatch({ type: 'setUnit', unit: e.target.value });
                }}
                value={state.unit}
              >
                <option value='meters'>Meters</option>
                <option value='kilometers'>Kilometers</option>
                <option value='miles'>Miles</option>
              </select>
            </label>
            <div className={styles.runnerInputs}>
              <span>Add Runners</span>
              {state.runners?.map((runner, index) => (
                <div className={styles.runnerInput} key={index}>
                  <input
                    className={styles.input}
                    type='text'
                    placeholder='Runner Name'
                    value={runner.name}
                    required
                    onChange={(e) => {
                      dispatch({
                        type: 'editRunner',
                        runner: { name: e.target.value },
                        index: index,
                      });
                    }}
                  />
                  {state.runners.length > 1 && (
                    <Button
                      onClick={() => {
                        dispatch({ type: 'removeRunner', index: index });
                      }}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type='button'
                onClick={(e) => {
                  e.preventDefault();
                  dispatch({ type: 'addRunner' });
                }}
              >
                Add Runner
              </Button>
            </div>
            <Button submit>Begin</Button>
          </form>
        </>
      ) : (
        <div>
          <Button
            onClick={() => {
              dispatch({ type: 'toggleActive' });
            }}
          >
            Edit Settings
          </Button>
          <div className={styles.runnerButtons}>
            {state.runners?.map((runner, index) => (
              <button
                key={index}
                onClick={() => {
                  dispatch({ type: 'setActiveRunner', index: index });
                }}
                className={`${styles.runnerButton} ${
                  index === state.activeRunner && styles.activeRunner
                }`}
              >
                {runner.name}
              </button>
            ))}
          </div>
          <div ref={timeContainer} className={styles.timer}>
            {formatTime(time)}
          </div>
          <div className={styles.timingButtons}>
            <button
              className={`${styles.timingButton} ${
                state.running ? styles.stop : styles.start
              }`}
              onClick={() => {
                window.gtag &&
                  window.gtag('event', state.running ? 'stop' : 'start', {
                    tool: 'Race Stopwatch',
                    event_category: 'timer',
                  });
                dispatch({ type: 'toggleRunning' });
              }}
            >
              {state.running ? 'Stop' : 'Start'}
            </button>
            {state.running ? (
              <button
                className={`${styles.timingButton} ${styles.lapButton}`}
                onClick={() => {
                  dispatch({ type: 'addRunnerSplit' });
                }}
                style={{
                  visibility:
                    state.runners[state.activeRunner].splits.length ===
                    Math.floor(state.distance / state.split)
                      ? 'hidden'
                      : 'visible',
                }}
              >
                Lap
              </button>
            ) : (
              <button
                className={`${styles.timingButton} ${styles.lapButton}`}
                onClick={() => {
                  if (
                    window.confirm("Resetting will clear all runner's times.")
                  ) {
                    dispatch({ type: 'reset', timer: timeContainer.current });
                  }
                }}
              >
                Reset
              </button>
            )}
          </div>
          <div className={styles.estimate}>
            <div>
              Current {state.distance}
              {abbreviations[state.unit]} estimate:
            </div>
            <div>
              {state.runners[state.activeRunner].splits.length
                ? formatTime(
                    (state.runners[state.activeRunner].splits[
                      state.runners[state.activeRunner].splits.length - 1
                    ] /
                      state.runners[state.activeRunner].splits.length) *
                      (state.distance / state.split)
                  )
                : '--:--.--'}
            </div>
          </div>
          <table className={styles.table}>
            <tbody>
              <tr>
                <th>Lap</th>
                <th>Distance</th>
                <th>Split</th>
                <th>Total Time</th>
              </tr>
            </tbody>
            {[...Array(Math.floor(state.distance / state.split))].map(
              (_, index) => {
                const runnerSplit =
                  state.runners[state.activeRunner].splits[index];
                const lapTime =
                  runnerSplit -
                  (state.runners[state.activeRunner].splits[index - 1] ?? 0);
                return (
                  <tbody key={index}>
                    <tr>
                      <td>{index + 1}</td>
                      <td>
                        {state.split * (index + 1)} {abbreviations[state.unit]}
                      </td>
                      <td>{runnerSplit ? formatTime(lapTime) : '--:--.--'}</td>
                      <td>
                        {' '}
                        {runnerSplit ? formatTime(runnerSplit) : '--:--.--'}
                      </td>

                      <button
                        style={{
                          visibility: !!runnerSplit ? 'visible' : 'hidden',
                        }}
                        onClick={() => {
                          dispatch({ type: 'clearSplit', index: index });
                        }}
                      >
                        Remove
                      </button>
                    </tr>
                  </tbody>
                  // <div key={index}>
                  //   {formatTime(split)}
                  // </div>
                );
              }
            )}
          </table>
        </div>
      )}
    </div>
  );
}

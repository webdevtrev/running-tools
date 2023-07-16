'use client';
import React, { useEffect, useState, useReducer } from 'react';
import styles from './page.module.css';

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
      return {
        ...state,
        time: 0,
        runners: state.runners.map((runner, index) => {
          return { ...runner, splits: [] };
        }),
      };
    case 'setDistance':
      return { ...state, distance: action.distance };
    case 'setSplit':
      return { ...state, split: action.split };
    case 'clearSplit':
      runners[state.activeRunner].splits.splice(action.index, 1);
      return {
        ...state,
        runners: runners,
      };
    case 'addRunnerSplit':
      runners[state.activeRunner].splits.push(state.time);
      return {
        ...state,
        runners: runners,
      };
    case 'addRunner':
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
    default:
      throw new Error();
  }
}

export default function Stopwatch() {
  const [state, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    if (state.running) {
      const start = Date.now();
      const current = state.time;
      const timer = setInterval(() => {
        dispatch({ type: 'updateTime', time: Date.now() - start + current });
      }, 100);
      return () => {
        clearInterval(timer);
      };
    }
  }, [state.running]);

  function formatTime(time) {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time - minutes * 60000) / 1000);
    const milliseconds = Math.floor(time - minutes * 60000 - seconds * 1000);
    return `${padZero(minutes)}:${padZero(seconds)}.${padZero(milliseconds)}`;
  }

  function padZero(number) {
    return number < 10 ? `0${number}` : number;
  }

  return (
    <div>
      {!state.active ? (
        <form
          className={styles.settings}
          onSubmit={(e) => {
            e.preventDefault();
            dispatch({ type: 'toggleActive' });
          }}
        >
          <label>
            Distance
            <input
              type='number'
              placeholder='5000'
              required
              value={state.distance}
              onChange={(e) => {
                dispatch({ type: 'setDistance', distance: e.target.value });
              }}
            />
            meters
          </label>
          <label>
            Splits
            <input
              type='number'
              placeholder='1600'
              required
              value={state.split}
              onChange={(e) => {
                dispatch({ type: 'setSplit', split: e.target.value });
              }}
            />
            meters
          </label>
          <div>
            {state.runners?.map((runner, index) => (
              <div key={index}>
                <input
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
                  <button
                    onClick={() => {
                      dispatch({ type: 'removeRunner', index: index });
                    }}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={() => {
                dispatch({ type: 'addRunner' });
              }}
            >
              Add Runner
            </button>
          </div>
          <button submit>Begin</button>
        </form>
      ) : (
        <div>
          <button
            onClick={() => {
              dispatch({ type: 'toggleActive' });
            }}
          >
            Edit Settings
          </button>
          <div>
            {state.runners?.map((runner, index) => (
              <button
                key={index}
                onClick={() => {
                  dispatch({ type: 'setActiveRunner', index: index });
                }}
              >
                {runner.name}
              </button>
            ))}
          </div>
          <div>{formatTime(state.time)}</div>
          <button
            onClick={() => {
              dispatch({ type: 'toggleRunning' });
            }}
          >
            {state.running ? 'Stop' : 'Start'}
          </button>
          {state.running ? (
            <button
              onClick={() => {
                dispatch({ type: 'addRunnerSplit' });
              }}
            >
              Lap
            </button>
          ) : (
            <button
              onClick={() => {
                if (
                  window.confirm("Resetting will clear all runner's times.")
                ) {
                  dispatch({ type: 'reset' });
                }
              }}
            >
              Reset
            </button>
          )}
          <div>
            <div>Current {state.distance}m estimate:</div>
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
          <table>
            <tbody>
              <tr>
                <th>Lap</th>
                <th>Distance</th>
                <th>Lap Time</th>
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
                      <td>{index}</td>
                      <td>{state.split * (index + 1)}m</td>
                      <td>{runnerSplit ? formatTime(lapTime) : '--:--.--'}</td>
                      <td>
                        {' '}
                        {runnerSplit ? formatTime(runnerSplit) : '--:--.--'}
                      </td>
                      <button
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

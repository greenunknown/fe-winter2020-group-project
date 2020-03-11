import React from 'react';
import AppSingleton, {App} from './App';

import {render, fireEvent, screen} from '@testing-library/react'
import "@testing-library/jest-dom/extend-expect";

it('renders without crashing', () => {
    const {getByText} = render(<AppSingleton />)
  })

it('main page has title Steam Dash', () => {
  const {getByText} = render(<App />)
  expect(getByText('Steam Dash')).toBeInTheDocument()
})

it('UserProfile component displays correct information', () => {
  const {getByText} = render(<UserProfile />);
})


// it('test test', () => {
//     const wrap = shallow(<UserProfile />);
//     var playerSummary = {
//         steamid: "testId",
//         personaname: "testName",
//         profileurl: "testURL",
//         avatar: null,
//         avatarmedium: null,
//         avatarfull: 'process.env.PUBLIC_URL/testImage.png',
//         lastlogoff: '1583907455',
//         timecreated: '1583907455'
//     }

//     wrap.setProps(playerSummary)

//     const personName = wrap.find('div.card-title').text();

//     expect(personName).toBe('testName');
// });
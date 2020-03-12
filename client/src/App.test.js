import React from 'react';
import App from './App';
import { UserProfile, UserPersonaState, FriendSummary, Wishlist, RecentlyPlayed,  SteamStatistics, }  from './Components'

import Enzyme, { shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });


it('renders Steam Dash as title in landing page', () => {
  const wrapper = shallow(<App/>);
  const header = wrapper.find('h1.titleHeader');
  const result = header.text();

  expect(result).toBe('Steam Dash');

})


it('doesnt render UserProfile when props are empty', () => {
  const playerSummary = {}
  const badges = {}

  expect(shallow(<UserProfile playerSummary={playerSummary} badges={badges} />)).toEqual({});
  
});

it('UserProfile displays correct information', () => {
  const playerSummary = {
          steamid: "testId",
          personaname: "testName",
          profileurl: "testURL",
          avatar: null,
          avatarmedium: null,
          avatarfull: 'process.env.PUBLIC_URL/testImage.png',
          lastlogoff: '1583907455',
          timecreated: '1583907455'
}

  const badges = {
    player_xp: 20,
    player_level: 21,
    player_xp_needed_to_level_up: 80
  }

  const wrapper = shallow(<UserProfile playerSummary={playerSummary} badges={badges}/>).dive();

  const div = wrapper.find('CardTitle');
  const name = div.text();
  const level = wrapper.find('CardText').text();
  
  expect(name).toBe('testName');
  expect(level.includes('Player Level: 21')).toBeTruthy();
});

it('PersonaState displays correct state', () => {
  const playerSummary = {
    steamid: "testId",
    personaname: "testName",
    profileurl: "testURL",
    avatar: null,
    avatarmedium: null,
    avatarfull: 'process.env.PUBLIC_URL/testImage.png',
    lastlogoff: '1583907455',
    timecreated: '1583907455',
    personastate: 2
}

  const badges = {
    player_xp: 20,
    player_level: 21,
    player_xp_needed_to_level_up: 80
  }

  const wrapper = shallow(<UserProfile playerSummary={playerSummary} badges={badges}/>).dive()
  const pState = wrapper.find('UserPersonaState').dive();
  
  var stateText = pState.find('CardHeader').text();

  expect(stateText).toBe('Busy');


});

it('RecentlyPlayed displays correct game', () => {
  const recentlyPlayed = {
    total_count: 1,
    games: [
      { appid: 1111,
        name: 'Test Game',
        img_logo_url:"49fa8c4d22576c88120d924f9a9daf565b09f299"
      }]
  };

  const wrapper = shallow(<RecentlyPlayed recentlyPlayed={recentlyPlayed}/>).dive();
  console.log(wrapper.debug());
  const gameName = wrapper.find('CardTitle').text();

  expect(gameName).toBe('Test Game');
});
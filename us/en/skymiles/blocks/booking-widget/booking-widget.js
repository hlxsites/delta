import { decorateIcons } from '../../scripts/lib-franklin.js';

export default function decorate(block) {
  block.innerHTML = `
    <form action="https://www.delta.com/flight-search/search">
      <button type="button" data-role="from">From<small>Your Origin</small></button>
      <button type="button" data-role="swap"><span class="icon icon-double-arrow"></span></button>
      <button type="button" data-role="to">To<small>Your Destination</small></button>
      <div class="select-wrapper" data-role="type">
        <select>
          <option value="roundtrip" selected>Round Trip</option>
          <option value="oneway">One way</option>
          <option value="multicity">Multi-City</option>
        </select>
        <span class="icon icon-down-chevron"></span>
      </div>
      <div class="input-wrapper" title="Depart" data-role="start">
        <input type="date" placeholder="Depart"/>
        <span class="icon icon-calendar"></span>
      </div>
      <div class="input-wrapper" title="Return" data-role="end">
        <input type="date" placeholder="Return"/>
        <span class="icon icon-calendar"></span>
      </div>
      <div class="select-wrapper" data-role="passengers">
        <select data-role="passengers">
          <option value="1" selected>1 Passenger</option>
          <option value="2">2 Passengers</option>
          <option value="3">3 Passengers</option>
          <option value="4">4 Passengers</option>
          <option value="5">5 Passengers</option>
          <option value="6">6 Passengers</option>
          <option value="7">7 Passengers</option>
          <option value="8">8 Passengers</option>
          <option value="9">9 Passengers</option>
        </select>
        <span class="icon icon-down-chevron"></span>
      </div>
      <button type="submit" title="Submit"><span class="icon icon-right-arrow"></span></button>
    </form>
  `;
  block.querySelectorAll('input[type="date"]').forEach((input) => {
    input.addEventListener('focus', () => {
      input.type = 'date';
    });
    input.addEventListener('blur', () => {
      input.type = 'text';
    });
    input.type = 'text';
  });
  decorateIcons(block);
}

import {
  Outlet,
  useLoaderData,
  Form,
  redirect,
  NavLink,
  useNavigation,
  useSubmit,
} from 'react-router-dom';
import { getContacts, createContact } from '../contacts';
import { useEffect } from 'react';

export async function loader({ request }) {
  const url = new URL(request.url);
  const q = url.searchParams.get('q');
  const contacts = await getContacts(q);
  return { contacts, q };
}
// create an action // <Form> send request to route 'action'. this action updated contacts db. <Form> replaces fetch data, useState, useEffect, onSubmit, useLoadData() hooks => UI stays in sync with updated data automatically. ==> to Update
export async function action({ request }) {
  const contact = await createContact();
  return redirect(`/contacts/${contact.id}/edit`);
}

export default function Root() {
  const submit = useSubmit();
  const { contacts, q } = useLoaderData();
  const navigation = useNavigation();

  // TO CHECK what's inside of location?
  // if (navigation.location) {
  //   for (const p in navigation.location) {
  //     console.log(p); //pathname, search, hash, state, key
  //   }
  //   console.log(navigation.location.search); // ?q=a
  // }
  // for search spinning
  const searching = navigation.location; //&& // navigation.location will be 'undefined' initially, then as an object when the app is navigating to a new URL, then undefined again when no more navigation
  // new URLSearchParams(navigation.location.search).has('q');

  // useEffect to remove search value if 'q' is not there anymore
  // useEffect(() => {
  //   document.getElementById('q').value = q;
  // }, [q]);

  return (
    <>
      <div id='sidebar'>
        <h1>React Router Contacts</h1>
        <div>
          <Form id='search-form' role='search'>
            {/**This Form is a Get method, so no action will be reached, only loader will access all 'request' info from 'name' attributes */}{' '}
            {/* use <Form> instead of <form>, for client side routing, no network event is triggered*/}
            <input
              id='q'
              className={searching ? 'loading' : ''}
              aria-label='Search contacts' // for an interactive element that has no accessible name
              placeholder='Search'
              type='search'
              name='q' //?q= after the root url
              defaultValue={q}
              // https://joequery.me/code/event-target-vs-event-currenttarget-30-seconds/
              onChange={(e) => {
                const isFirstSearch = q === null;
                submit(e.currentTarget.form, { replace: !isFirstSearch }); // replace helps to clean up history stack, only count one history for search
              }} // only e.currentTarget is ok when onChange() is within <Form> or <button> or type
            />
            <div id='search-spinner' aria-hidden hidden={!searching} />
            <div className='sr-only' aria-live='polite'></div>
          </Form>
          {/* use Form for client-side routing to '/test', use form for server side routing */}
          <Form method='post'>
            <button type='submit'>New</button>
          </Form>
        </div>

        <nav>
          {contacts.length ? (
            <ul>
              {contacts.map((contact) => (
                <li key={contact.id}>
                  <NavLink
                    to={`contacts/${contact.id}`}
                    className={({ isActive, isPending }) =>
                      isActive ? 'active' : isPending ? 'pending' : ''
                    }
                  >
                    {contact.first || contact.last ? (
                      <>
                        {contact.first} {contact.last}
                      </>
                    ) : (
                      <i>No Name</i>
                    )}{' '}
                    {contact.favorite && <span>★</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>No contacts</i>
            </p>
          )}
        </nav>
      </div>
      <div
        id='detail'
        className={navigation.state === 'loading' ? 'loading' : ''}
      >
        <Outlet />
      </div>
    </>
  );
}

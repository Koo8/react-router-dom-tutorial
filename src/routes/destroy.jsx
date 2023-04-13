import React from 'react';
import { deleteContact } from '../contacts';
import { redirect } from 'react-router-dom';

export async function destoryAction({ params }) {
  // throw new Error('Oh, no!');
  await deleteContact(params.contactId);
  return redirect('/');
}

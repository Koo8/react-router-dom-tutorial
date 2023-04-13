import { Form, redirect, useLoaderData, useNavigate } from 'react-router-dom';
import { updateContact } from '../contacts';

// TODO: action from Form receive a request and params
export async function action({ request, params }) {
  //   console.log(request);
  const formData = await request.formData(); // a prommise, this is a web API FormData
  for (const p of formData) {
    console.log(p);
  }
  const updates = Object.fromEntries(formData);
  await updateContact(params.contactId, updates);
  return redirect(`/contacts/${params.contactId}`); // redirect is preferred over useNavigate for loader and action
}

export default function EditContact() {
  const { contact } = useLoaderData();
  const navigate = useNavigate();

  return (
    <>
      <Form method='post' id='contact-form'>
        <p>
          <span>Name</span>
          <input
            placeholder='First'
            aria-label='First name'
            type='text'
            name='first'
            defaultValue={contact.first}
          />
          <input
            placeholder='Last'
            aria-label='Last name'
            type='text'
            name='last'
            defaultValue={contact.last}
          />
        </p>
        <label>
          <span>Twitter</span>
          <input
            type='text'
            name='twitter'
            placeholder='@jack'
            defaultValue={contact.twitter}
          />
        </label>
        <label>
          <span>Avatar URL</span>
          <input
            placeholder='https://example.com/avatar.jpg'
            aria-label='Avatar URL'
            type='text'
            name='avatar'
            defaultValue={contact.avatar}
          />
        </label>
        <label>
          <span>Notes</span>
          <textarea name='notes' defaultValue={contact.notes} rows={6} />
        </label>
        <p>
          <button type='submit'>Save</button>
          <button type='button' onClick={() => navigate(-1)}>
            {' '}
            {/* type='button' prevent this button to submit form when clicking, so preventDefault is not needed */}
            Cancel
          </button>
        </p>
      </Form>
    </>
  );
}

import {fetchSync} from '@shopify/hydrogen';
import {useState} from 'react';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetchSync('/newsletter', {
      method: 'POST',
      body: JSON.stringify({email}),
    });

    // Log the response from our API route
    console.log(await response.json());
  };

  return (
    <>
      <form method="POST" action="/" onSubmit={handleSubmit}>
        <label>
          Email:{' '}
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <button>Subscribe</button>
      </form>
    </>
  );
}

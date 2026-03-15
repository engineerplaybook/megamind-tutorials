import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <div style={{ maxWidth: '600px' }}>
        <h1 style={{
          fontSize: 'clamp(6rem, 15vw, 10rem)',
          fontWeight: 800,
          margin: 0,
          background: 'linear-gradient(135deg, var(--color-primary, #0070f3) 0%, #2a52be 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 10px 30px rgba(0, 112, 243, 0.2)',
          lineHeight: 1
        }}>
          404
        </h1>
        
        <h2 style={{
          fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
          fontWeight: 700,
          margin: '1.5rem 0 1rem',
          color: 'var(--color-text, #111827)'
        }}>
          Oops! Looks like you're lost.
        </h2>
        
        <p style={{
          fontSize: '1.1rem',
          color: 'var(--color-text-secondary, #6b7280)',
          lineHeight: 1.6,
          marginBottom: '2.5rem',
          maxWidth: '500px',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}>
          The tutorial, playground, or page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>

        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => navigate('/')}
            style={{
              padding: '0.8rem 2rem',
              fontSize: '1.05rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              borderRadius: '50px',
              backgroundColor: 'var(--color-primary, #0070f3)',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(0, 112, 243, 0.3)',
              transition: 'all 0.3s ease',
              fontWeight: 500
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 112, 243, 0.5)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 112, 243, 0.3)';
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Back to Home
          </button>
          
          <button
            onClick={() => navigate(-1)}
            style={{
              padding: '0.8rem 2rem',
              fontSize: '1.05rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              borderRadius: '50px',
              backgroundColor: 'transparent',
              color: 'var(--color-text, #111827)',
              border: '2px solid var(--color-border, #e5e7eb)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontWeight: 500
            }}
             onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.borderColor = 'var(--color-text, #111827)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'var(--color-border, #e5e7eb)';
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
            Go Back
          </button>
        </div>
        
        <div style={{
          marginTop: '4rem',
          opacity: 0.5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <svg style={{ width: '3rem', height: '3rem', color: 'var(--color-text-secondary, #6b7280)', opacity: 0.5 }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
          <p style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--color-text-secondary, #6b7280)', marginTop: '1rem' }}>
            ERR_TUTORIAL_NOT_FOUND
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

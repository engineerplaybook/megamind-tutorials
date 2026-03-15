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
      <h1 style={{
        fontSize: '3rem',
        fontWeight: 700,
        margin: '0 0 1rem 0',
        color: 'var(--color-text, #111827)'
      }}>
        404
      </h1>
      
      <p style={{
        fontSize: '1.25rem',
        color: 'var(--color-text-secondary, #6b7280)',
        lineHeight: 1.6,
        marginBottom: '2.5rem',
        maxWidth: '600px',
        marginLeft: 'auto',
        marginRight: 'auto'
      }}>
        Engineer Playbook doesn't have this yet, or you are lost, but you can request a feature by reaching out to maintainers directly.
      </p>

      <button
        onClick={() => navigate('/')}
        style={{
          padding: '0.8rem 2rem',
          fontSize: '1.05rem',
          borderRadius: '50px',
          backgroundColor: 'var(--color-primary, #0070f3)',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          fontWeight: 500,
          textDecoration: 'none'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = '#0056b3';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--color-primary, #0070f3)';
        }}
      >
        Go to Playbook Profile
      </button>
    </div>
  );
};

export default NotFound;

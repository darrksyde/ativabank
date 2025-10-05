// Clear localStorage to force database re-initialization
console.log('Clearing localStorage...');
localStorage.removeItem('ativabank_database');
localStorage.removeItem('ativabank_backup');
localStorage.removeItem('ativabank_session');
console.log('localStorage cleared. Please refresh the page.');
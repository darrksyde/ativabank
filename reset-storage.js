// Reset script to clear all localStorage data and fix any corruption issues
if (typeof window !== 'undefined') {
  // Clear all Ativabank related data
  localStorage.removeItem('ativabank_session');
  localStorage.removeItem('ativabank_user'); // Old format
  localStorage.removeItem('ativabank_database');
  
  console.log('Cleared all Ativabank localStorage data');
  
  // Force reload to reinitialize clean state
  window.location.reload();
}
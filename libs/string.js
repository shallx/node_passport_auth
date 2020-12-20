const initials = (s) =>{
  return s.split(' ').splice(0,2).map(name => name[0]).join('');
}

const firstName = (s) =>{
  return s.split(' ')[0];
}

module.exports = {
  initials,
  firstName
}
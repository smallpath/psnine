export const sync = (psnid) => {
  return fetch(`http://psnine.com/psnid/${psnid}/up`, {
    headers: {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Referer': `http://psnine.com/psnid/${psnid}`
    }
  })
}

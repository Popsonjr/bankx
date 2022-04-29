/***
-- Space Exploration Technologies Corp.
--
-- @version 1.0
-- @date 21.05.2020
-- @url https://spacex.com
***/

const reEscape = /[&<>'"]/g
const reUnescape = /&(?:amp|#38|lt|#60|gt|#62|apos|#39|quot|#34);/g

const oEscape = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  "'": '&#39;',
  '"': '&quot;'
}

const oUnescape = {
  '&amp;': '&',
  '&#38;': '&',
  '&lt;': '<',
  '&#60;': '<',
  '&gt;': '>',
  '&#62;': '>',
  '&apos;': "'",
  '&#39;': "'",
  '&quot;': '"',
  '&#34;': '"'
}

const fnEscape = (m) => oEscape[m]
const fnUnescape = (m) => oUnescape[m]

const util = {
  escape: (s) => String.prototype.replace.call(s, reEscape, fnEscape),
  unescape: (s) => String.prototype.replace.call(s, reUnescape, fnUnescape)
}

function escaping (pieces) {
  let result = pieces[0]
  const substitutions = [].slice.call(arguments, 1)
  for (var i = 0; i < substitutions.length; ++i) {
    result += util.escape(substitutions[i]) + pieces[i + 1]
  }
  return result
}

const escapestr = (str) => escaping`${str}`

const Internships = () => {
  const breakPoint = deviceSettings.isMobile
  const jobs = getId('jobs-list')

  const none = () => jobs.innerHTML = `<span>There are no jobs in this department.</span>`

  const html = (job) => {
    const type = job.metadata.find((entry) => entry.name === 'Employment Type')
    const desktop = `
      <td><a href="${escapestr(job.absolute_url)}" target="_blank">${escapestr(job.title)}</a></td>
      <td>${escapestr(job.location.name)}</td>
      <td>${escapestr(type.value)}</td>
    `
    const mobile = `
      <a class="careers-item-title" href="${escapestr(job.absolute_url)}" target="_blank">${escapestr(job.title)}</a>
      <div class="careers-item-line">
        <span>Location</span>
        <span>${escapestr(job.location.name)}</span>
      </div>
      <div class="careers-item-line">
        <span>Employment Type</span>
        <span>${escapestr(type.value)}</span>
      </div>
    `
    return breakPoint ? mobile : desktop
  }

  const reset = () => {
    jobs.innerHTML = breakPoint ? `<h2>Open Internships</h2>` : `
    <h2>Open Internships</h2>
    <table class="jobs">
      <tbody>
        <tr>
          <th><strong>Job Title</strong></th>
          <th><strong>Location</strong></th>
          <th><strong>Employment Type</strong></th>
        </tr>
      </tbody>
    </table>
    `
  }

  const update = () => {
    let empty = true
    const fragment = document.createDocumentFragment()
    if (internships.length > 0) {
      empty = false
      internships.forEach((job) => {
        const el = breakPoint ? document.createElement('div') : document.createElement('tr')
        breakPoint && el.classList.add('careers-item')
        el.innerHTML = html(job)
        fragment.appendChild(el)
      })
    }
    if (!empty) {
      reset()
      if (breakPoint) {
        jobs.appendChild(fragment)
      } else {
        query('#jobs-list table tbody').appendChild(fragment)
      }
    } else {
      none()
    }
    jobs.style.display = 'block'
    onResize()
    window.scrollTo(0, innerHeight - 100)
  }

  const internships = []
  const loader = getId('loader')
  const APIReady = (json) => {
    console.log(json)
    getId('api-buttons').style.display = 'block'
    loader.parentNode.removeChild(loader)

    json.jobs.forEach((job) => {
      const category = job.metadata.find((meta) => meta.name === 'Posting Category');
      if (category.value) {
        if (category.value === 'Internships' || category.value.includes('Internship') || category.value.includes('internship')) {
          internships.push(job);
        }
      }
    });

    console.log(internships)

    queryAll('.js-internships').forEach((el) => {
      el.addEventListener('click', (e) => {
       e.preventDefault()
       update()
      })
    })

    reset()
  }

  async function loadAPI () {
    let response = await fetch('https://boards-api.greenhouse.io/v1/boards/spacex/jobs', {
      method: 'GET'
    }).then(function(response) {
      return response.json()
    }).then(function(json) {
      APIReady(json)
    })
  }
  loadAPI()
}

if (document.readyState != 'loading'){
  Internships()
} else {
  document.addEventListener('DOMContentLoaded', Internships)
}

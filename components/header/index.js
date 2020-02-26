var html = require('choo/html')
var Component = require('choo/component')
var { text } = require('../base')

module.exports = class Header extends Component {
  constructor (id, state, emit) {
    super(id)
    this.emit = emit
    this.state = state
    this.local = state.components[id] = {
      id: id
    }
  }

  update (href) {
    return href !== this.local.href
  }

  createElement (href) {
    this.local.href = href.replace(/\/$/, '')
    var that = this
    var { id } = this.local
    var home = this.local.href === '/start' || this.local.href === ''
    var hideGoals = this.local.href === '' || this.local.href === '/om' || this.local.href === '/villkor'
    var backlink = this.local.href.indexOf('/start') !== -1 ? '/start' : '/'

    function onclick (event) {
      that.emit('pushState', that.state.prev, { persistScroll: false })
      event.preventDefault()
    }

    return html`
      <div class="Header">
        <header class="Header-bar" id="${id}">
          ${home ? html`
            <span class="Header-logo">
              <span class="u-hiddenVisually">${text`Till startsidan`}</span>
              <svg role="presentation" viewBox="0 0 1410 152">
                <g fill="none" fill-rule="evenodd">
                  <path fill="#000" d="M83.0095 28.6871l-16.4 9.699c-3.06-5.323-5.975-8.795-8.749-10.417-2.889-1.85-6.618-2.781-11.184-2.783-5.609-.006-10.265 1.582-13.967 4.756-3.703 3.119-5.557 7.051-5.561 11.788-.005 6.535 4.845 11.799 14.556 15.798l13.35 5.474c10.865 4.406 18.809 9.773 23.834 16.109 5.024 6.336 7.532 14.099 7.52402 23.292-.01202 12.313-4.12502 22.488-12.34102 30.514-8.275 8.087-18.542 12.126-30.797 12.11602-11.621-.01102-21.216-3.45902-28.783-10.34802-7.452-6.886-12.098-16.574-13.936-29.064l20.47-4.491c.917 7.864 2.532 13.301 4.843 16.308 4.157 5.786 10.225 8.681 18.203 8.689 6.302.005 11.535-2.101 15.703-6.317 4.166-4.217 6.252-9.561 6.258-16.037.001-2.603-.359-4.988-1.079-7.157-.721-2.167-1.847-4.164-3.377-5.988-1.53-1.821-3.508-3.528-5.935-5.12-2.426-1.593-5.318-3.111-8.669-4.56l-12.916-5.389c-18.32-7.763-27.474-19.102-27.461-34.02.009-10.06 3.862-18.467 11.558-25.226 7.693-6.813 17.266-10.217 28.713-10.20603 15.436.01303 27.484 7.54003 36.143 22.58003M130.1291 69.5743l7.545.00504c18.558.01896 27.843-7.11404 27.85601-21.39404.01199-13.817-9.55101-20.735-28.68701-20.753l-6.677-.005-.037 42.147zm-.018 18.73l-.047 54.375-20.206-.016.118-133.901 22.894.022c11.216.011 19.686.798 25.408 2.364 5.779 1.566 10.865 4.519 15.256 8.861 7.681 7.521 11.517 17.007 11.50802 28.453-.01102 12.259-4.12502 21.968-12.34002 29.128-8.218 7.163-19.293 10.736-33.224 10.725l-9.367-.011zM225.2078 8.8668l-.118 133.898-20.206-.019.118-133.898zM275.8113 8.9117l-.102 114.907 39.372.035-.016 18.991-59.578-.054.118-133.898zM353.6677 8.981l-.103 114.907 39.373.035-.017 18.991-59.577-.054.118-133.898zM626.7043 29.171l-16.4 9.699c-3.06-5.323-5.976-8.795-8.75-10.417-2.889-1.85-6.618-2.781-11.183-2.783-5.609-.006-10.266 1.582-13.968 4.756-3.702 3.119-5.556 7.051-5.56 11.788-.006 6.535 4.845 11.799 14.556 15.798l13.35 5.474c10.865 4.406 18.809 9.773 23.834 16.109 5.023 6.336 7.531 14.099 7.52302 23.292-.01102 12.313-4.12502 22.488-12.34002 30.514-8.276 8.087-18.542 12.126-30.797 12.11502-11.621-.01002-21.217-3.45802-28.783-10.34702-7.452-6.886-12.098-16.574-13.937-29.064l20.471-4.491c.917 7.864 2.532 13.301 4.842 16.308 4.157 5.786 10.225 8.681 18.204 8.689 6.301.005 11.535-2.101 15.702-6.317 4.166-4.217 6.252-9.561 6.258-16.037.002-2.603-.358-4.988-1.079-7.157-.72-2.167-1.846-4.164-3.376-5.988-1.53-1.821-3.508-3.528-5.936-5.12-2.426-1.593-5.317-3.111-8.668-4.56l-12.916-5.389c-18.321-7.763-27.475-19.102-27.462-34.02.01-10.06 3.862-18.467 11.558-25.226 7.694-6.813 17.267-10.217 28.713-10.20603 15.436.01303 27.484 7.54003 36.144 22.58003M667.31397 75.8624c-.01397 14.801 4.94703 26.975 14.88303 36.524 9.879 9.548 21.292 14.328 34.244 14.33903 14.048.01297 25.903-4.83403 35.567-14.53803 9.664-9.818 14.503-21.783 14.51503-35.889.01397-14.28-4.74603-26.252-14.27703-35.916-9.474-9.723-21.205-14.588-35.197-14.60202-13.933-.00998-25.702 4.83402-35.306 14.53802-9.608 9.59-14.417 21.437-14.42903 35.544m-20.3793-.279c.01803-18.847 6.93803-35.028 20.76933-48.545 13.771-13.516 30.312-20.267 49.623-20.24804 19.079.01604 35.432 6.85404 49.066 20.50904 13.691 13.657 20.525 30.053 20.50903 49.19-.01803 19.251-6.91103 35.579-20.68203 48.978-13.831 13.461-30.516 20.179-50.057 20.16403-17.288-.01703-32.805-6.01503-46.553-17.99503-15.1363-13.25-22.6933-30.603-22.67533-52.053M877.442 28.4395l-46.656-.042-.03 32.175 45.008.04-.016 18.991-45.009-.04-.056 63.741-20.206-.019.118-133.898 66.864.061zM973.856 28.525l-53.681-.048-.029 32.175 52.12.045-.017 18.994-52.121-.048-.04 44.748 53.681.048-.016 18.993-73.886-.066.118-133.899 73.887.067zM1019.671 71.0606l6.418.00503c19.136.01597 28.711-7.28703 28.72401-21.91503.01199-13.703-9.29001-20.562-27.90601-20.578l-7.198-.008-.038 42.496zm25.136 15.373l41.402 57.097-24.715-.021-38.197-54.844-3.643-.002-.047 54.808-20.206-.018.119-133.898 23.674.021c17.692.016 30.465 3.353 38.323 10.007 8.666 7.41 12.993 17.183 12.982 29.325-.008 9.481-2.734 17.63-8.173 24.446-5.442 6.82-12.615 11.178-21.519 13.079zM1104.554 143.5465l.126-143.004 97.559 102.247.082-93.054 20.206.019-.126 142.05-97.559-101.984-.082 93.745zM1324.223 92.2315l-19.817-45.548-20.855 45.511 40.672.037zm8.222 18.999l-57.324-.051-14.944 32.508-21.767-.021 66.382-142.252 63.788 142.368-22.115-.018-14.02-32.534zM1388.097 113.9688l.092-104.068 19.598.019-.091 104.065-19.599-.016zm-2.27201 20.115c.00101-3.235 1.18901-6.037 3.56201-8.407 2.371-2.368 5.207-3.551 8.502-3.549 3.296.003 6.126 1.192 8.496 3.563 2.367 2.374 3.551 5.208 3.54801 8.503-.00301 3.355-1.19101 6.215-3.56501 8.582-2.314 2.31-5.149 3.464-8.5 3.461-3.413-.002-6.273-1.162-8.584-3.477-2.31-2.313-3.462-5.206-3.45901-8.676z"/>
                  <path fill="#56C22B" d="M429.4412 55.9395c1.662-2.992 3.822-5.65 6.315-8.144l-20.607-22.601c-5.152 4.985-9.64 10.636-13.129 16.951l27.421 13.794z"/>
                  <path fill="#DDA63A" d="M479.9626 39.9849c3.158 1.496 5.983 3.324 8.642 5.318l20.608-22.435c-5.485-4.654-11.634-8.476-18.281-11.467l-10.969 28.584z"/>
                  <path fill="#C5192D" d="M527.1609 46.7989l-27.255 13.628c1.329 2.991 2.16 6.315 2.659 9.639l30.412-2.826c-.997-7.312-2.991-14.126-5.816-20.441"/>
                  <path fill="#4C9F38" d="M497.7449 56.4381l27.255-13.627c-3.323-6.316-7.644-11.966-12.796-16.952l-20.608 22.435c2.493 2.494 4.487 5.152 6.149 8.144"/>
                  <path fill="#3F7E44" d="M424.1228 75.8824v-1.828l-30.413-2.659c-.166 1.496-.166 2.991-.166 4.487 0 5.816.665 11.467 1.995 16.951l29.415-8.475c-.498-2.826-.831-5.651-.831-8.476"/>
                  <path fill="#FCC30B" d="M493.9226 100.8106c-2.16 2.659-4.653 4.986-7.479 6.98l16.121 25.926c5.983-3.989 11.301-8.974 15.788-14.625l-24.43-18.281z"/>
                  <path fill="#FF3A21" d="M502.8967 75.8824c0 2.825-.332 5.65-.831 8.31l29.416 8.475c1.33-5.318 1.994-10.969 1.994-16.785 0-1.496 0-2.825-.166-4.321l-30.413 2.825v1.496z"/>
                  <path fill="#FD9D24" d="M433.5959 101.3092l-24.264 18.447c4.487 5.485 9.806 10.47 15.788 14.292l16.121-25.925c-2.992-1.828-5.485-4.155-7.645-6.814"/>
                  <path fill="#0A97D9" d="M424.6213 69.567c.499-3.49 1.496-6.647 2.992-9.805l-27.256-13.628c-2.991 6.481-5.152 13.295-5.983 20.608l30.247 2.825z"/>
                  <path fill="#A21942" d="M498.9084 136.043l-15.954-25.926c-2.992 1.662-5.983 2.992-9.307 3.822l5.651 30.081c6.98-1.662 13.627-4.321 19.61-7.977"/>
                  <path fill="#26BDE2" d="M500.9026 88.5128c-.997 3.158-2.493 6.149-4.321 8.808l24.43 18.447c3.989-5.651 7.146-11.966 9.307-18.779l-29.416-8.476z"/>
                  <path fill="#FD6925" d="M469.1604 114.7706c-1.828.333-3.822.333-5.65.333-1.496 0-3.158-.166-4.654-.333l-5.651 30.081c3.325.498 6.814.83 10.304.83 3.823 0 7.645-.332 11.301-.997l-5.65-29.914z"/>
                  <path fill="#E5243B" d="M466.0027 36.4952c3.324.166 6.647.831 9.805 1.828l10.969-28.418c-6.482-2.327-13.462-3.657-20.774-3.989v30.579z"/>
                  <path fill="#DD1367" d="M454.5354 114.272c-3.49-.831-6.647-1.994-9.639-3.656l-16.12 25.926c6.149 3.489 12.963 6.148 20.109 7.644l5.65-29.914z"/>
                  <path fill="#19486A" d="M451.7107 38.1573c3.157-.997 6.481-1.662 9.971-1.828V5.7503c-7.312.166-14.458 1.495-20.94 3.822l10.969 28.585z"/>
                  <path fill="#BF8B2E" d="M430.7708 97.8194c-1.995-2.825-3.49-5.983-4.654-9.307l-29.415 8.476c2.16 6.98 5.484 13.461 9.639 19.444l24.43-18.613z"/>
                  <path fill="#00689D" d="M439.0798 44.9708c2.659-1.994 5.484-3.822 8.476-5.152l-10.969-28.418c-6.647 2.825-12.63 6.481-17.948 10.968l20.441 22.602z"/>
                </g>
              </svg>
            </span>
          ` : html`
            <a class="Header-back" href="${backlink}" onclick=${onclick}>
              <svg role="presentation" viewBox="0 0 7 12">
                <path fill="none" fill-rule="evenodd" stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M6 1.75736L1.75736 6 6 10.24264"/>
              </svg>
              <span>${text`Tillbaka`}</span>
            </a>
          `}

          ${!hideGoals ? html`
            <a class="Header-gg" href="/malen">
              <span>${text`Globala målen`}</span>
              <svg role="presentation" viewBox="0 0 80 80">
                <g fill="none" fill-rule="evenodd">
                  <path fill="#56C22B" d="M20.69 28.55c.99-1.68 2.2-3.22 3.57-4.58L12.55 11.15a40.3 40.3 0 00-7.44 9.66l15.58 7.74"/>
                  <path fill="#DDA63A" d="M49.3 19.64c1.78.81 3.43 1.85 4.93 3.08L66.03 9.9a40.02 40.02 0 00-10.46-6.5L49.3 19.64"/>
                  <path fill="#C5192D" d="M76.39 23.42l-15.6 7.78a22.56 22.56 0 011.57 5.5l17.34-1.63a39.91 39.91 0 00-3.31-11.65"/>
                  <path fill="#4C9F38" d="M59.44 28.81l15.68-7.75a40.01 40.01 0 00-7.33-9.65L55.96 24.2a22.4 22.4 0 013.48 4.6"/>
                  <path fill="#3F7E44" d="M17.56 40.09c0-.35.01-.7.04-1.06L.24 37.47a40.48 40.48 0 001.1 12.33l16.75-4.84c-.33-1.57-.53-3.2-.53-4.87"/>
                  <path fill="#FCC30B" d="M57.44 54.28a22.68 22.68 0 01-4.25 3.99l9.2 14.86a40.44 40.44 0 008.99-8.35l-13.94-10.5"/>
                  <path fill="#FF3A21" d="M62.42 40.1a22 22 0 01-.52 4.8l16.76 4.82a39.87 39.87 0 001.1-12.09l-17.35 1.65v.81"/>
                  <path fill="#FF9F24" d="M22.9 54.6L9.08 65.2a40.32 40.32 0 009.04 8.26l9.14-14.9a23.02 23.02 0 01-4.34-3.96"/>
                  <path fill="#0A97D9" d="M17.76 36.38c.3-1.95.89-3.81 1.67-5.56L3.74 23.09A39.05 39.05 0 00.28 34.83l17.48 1.55"/>
                  <path fill="#A21942" d="M60.29 74.31l-9.2-14.83a22.64 22.64 0 01-5.35 2.17l3.24 17.16a39.87 39.87 0 0011.3-4.5"/>
                  <path fill="#26BDE2" d="M61.35 47.15a23.07 23.07 0 01-2.44 5l13.9 10.47a39.7 39.7 0 005.25-10.67l-16.71-4.8"/>
                  <path fill="#FF6924" d="M43.34 62.12a22.88 22.88 0 01-5.88.09l-3.24 17.13a40.4 40.4 0 0012.36-.1l-3.24-17.12"/>
                  <path fill="#E8203A" d="M41.33 17.7c1.95.13 3.82.5 5.6 1.09L53.2 2.43A39.83 39.83 0 0041.33.18V17.7"/>
                  <path fill="#DD1367" d="M34.88 61.76a22.61 22.61 0 01-5.57-2.07L20.1 74.42c3.55 2.01 7.43 3.5 11.54 4.36l3.25-17.02"/>
                  <path fill="#19486A" d="M33.22 18.54c1.83-.57 3.76-.92 5.75-1.01V.17c-4.24.1-8.3.87-12.12 2.17l6.37 16.2"/>
                  <path fill="#BF8B2E" d="M21.48 52.66c-1.1-1.64-2-3.44-2.65-5.35L2.09 52.14A40.47 40.47 0 007.6 63.26l13.87-10.6"/>
                  <path fill="#00689D" d="M26.19 22.4a22.69 22.69 0 014.87-2.9L24.7 3.3a40.5 40.5 0 00-10.37 6.27L26.2 22.4"/>
                </g>
              </svg>
            </a>
          ` : null}
        </header>
      </div>
    `
  }
}

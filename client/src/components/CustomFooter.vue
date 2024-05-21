<template>
  <footer>
    <div class="footer-wrapper">
      <div class="footer-mid">
        <div class="contact-wrapper">
          <span>Find me elsewhere on the web as well:</span>
          <ul class="contact-links">
            <li class="contact-link" v-for="(link, i) of links" :key="i">
              <a :href="link.url" target="_blank">
                <font-awesome-icon :icon="link.icon" />
                <span class="contact-link-title">{{ link.title }}</span>
              </a>
            </li>
          </ul>
        </div>
        <span class="copyright">
          <font-awesome-icon :icon="faCopyright" />
          An e-commerce web application using Vue.js / Express.js
        </span>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { faCopyright } from '@fortawesome/free-regular-svg-icons';
import { faFacebook, faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';

const links = [
  {
    title: 'Facebook',
    icon: faFacebook,
    url: 'https://www.facebook.com/seowzhixuan0126'
  },
  {
    title: 'LinkedIn',
    icon: faLinkedin,
    url: 'https://www.linkedin.com/in/zhixuan98/'
  },
  {
    title: 'GitHub',
    icon: faGithub,
    url: 'https://github.com/zhixuan1998'
  }
];
</script>

<style lang="scss" scoped>
footer {
  width: 100%;
  min-height: 200px;
  background-color: func.theme-color(xl);
  color: func.theme-color(s);

  .footer-wrapper {
    @include mix.base-wrapper;

    height: 100%;
    display: flex;
    padding-top: 50px;
    padding-bottom: 50px;

    & > * {
      flex-grow: 1;
    }

    .footer-mid {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .contact-wrapper {
        text-align: center;

        .contact-links {
          margin-bottom: 2rem;
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          column-gap: 15px;

          .contact-link a {
            display: flex;
            align-items: center;
            column-gap: 5px;

            .contact-link-title {
              position: relative;
              font-weight: 900;

              &::before {
                position: absolute;
                content: '';
                bottom: 0;
                width: 0;
                height: 1px;
                background-color: currentColor;
                transition: width 0.15s;
              }
            }

            &:hover {
              color: func.theme-color(m);

              .contact-link-title::before {
                width: 100%;
              }
            }
          }
        }
      }

      .copyright {
        text-align: center;
      }
    }
  }
}
</style>

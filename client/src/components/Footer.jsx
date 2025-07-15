function Footer() {
  return (
    <>
      <footer>
        <div className="footer-container">
          <div className="column-1">
            <ul className="footer-links">
              <p>navigate</p>
              <li>Contact us</li>
              <li>FAQs</li>
              <li>Cancel booking</li>
              <li>Reserve a stay</li>
              <li>Track your stay</li>
            </ul>
          </div>
          <div className="column-2">
            <p>Footer links</p>
            <ul className="explore footer-links">
              <li>Categories</li>
              <li>Rooms</li>
              <li>Best Sellers</li>
              <li>Special Offers</li>
            </ul>
          </div>
          <div className="column-3">
            <p>Socials</p>
            <ul className="contact footer-links">
              <li>
                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAjNJREFUSEvF1UnITWEYB/DfhyLCRlamQiEJkSQskFJfMmS2sTEsFBmKLJTIELKyYCF9hoxRSuykJJIyJpKyYUVW5vfRe+t0Oqd7U7fvrds95x2e///5/5/nPR3aPDraHF+3AYzEVszEeGqJ/MEz3MNxvCkrUpXBBpxAL3zAA7yqkXIyJmIofmATThX3lgGm5IAvsAhvW/QosryBYZiKJ41zZYCrWIAxeN9C8LVJvr34krJdh0cpo+tYUgcQQYN9gBRHD8zDOPzCS9zNc7ezlMMzwCCMqAP4ii5sLEQPfS9iegk0jD2ddP+EwTiDUGA++tUB/MYR7Mgbgvn9zGgb7qBnZn4oV80sRDXFCCJL855/E2UPYuMB7MoHluVD8X+plMHy5NWFZOjCbHAsn0/yxXwQqwUIZjvzejxvR398KwGE1p9TOe9LvuzJayHvqiLxqgyiYbbkAwezXANT44U/xdEA2J96YHdeOIs1zQCO5S6OM1Ful7OuV0oAwTQYFyWK9xXNPChm0DA5SjCkCpOjw+emSjmM15hdMjkA+9R5EDoHi/UFtkOymTMqynQlPhbmo0znICStNDkuq/hVNVow60wV9h23cLPAvBHvMQYkkqPrAIL94lSaY1u8KopJTUj311OcSyRX1wFMSiyDRWwMg9+VZKl7jeDXEF5NyzEqJYrJxnUdBj/MksT8TzxPjdgbo7LZMd8XcQvH+macLLKo+6L9zwfnaNX13m2fzBalb76t7Rn8BcJ+cxlsKeBhAAAAAElFTkSuQmCC" />
              </li>
              <li>
                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAcFJREFUSEu11T+oT2EYwPHPLYUwyCIki0GRjKRkEJIuMYgsFDKIlAzyJxnUFQburTtYlEEU+TORQWajvyXCYjAoinCeen86vZ3znt8P92znff58n+d9/rxDJvgbmmD/ugCTsQXrsBQL8Atv8BT3cRPf2wItAdbjcnJaSvQV9uFBk1Ib4GQV6YkBru8njuBcbtMEOIXjAzivqx7ExfpBDtiI2wXnn3AYj/A26Y2ks/iNTFbhcc9HHTAdLzG7BfADi/E8k9cBIQr5kl7h64Ao1Ggh+mvYXpOvwQqsxfLMbhNuxVkdcAcbCoBjOJPkW3G9oDuOPTngPeYUjA7hQpJHMc8XdGNGluWAr5jynwCfq26amQO+YFoG+NiRVag/xOrMLnzNyAEvsDBT/IC5HTPxDvMynWdYlAOuVm26Y8AMYld9awjgSjUnu3LANkQrtn2DFLmxTSfhNea3EPoF/LmePIP4jw167x8AscpX4knPR9Oyi2V1oAHSTwan80XZBIizsd4k1kBdgLNVwY/mgZUenJ1pWmclozZAbIC9uNt0tV1P5lTsxub0NF5KTvZjuNqaNxAt+VdPZsd89SfuyqA/LwWt33YeVhnsaaE0AAAAAElFTkSuQmCC" />
              </li>
              <li>
                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAZtJREFUSEvd1b1rFVEQBfBfNKAQsYqFoBiFIEIUESstlYAhYJQQIoJFLETsFUXxD9DGQrERCdjYWAiBFDYS0gQFxRSpEhIQBbESwS9I7sA+WNbdzb4Hr8nt9s6dc+6cO3O2R5dXT5fxbT2CPvzcRLbduI9RHMRfPMYd7MX57Hs9cPISbcciJvCphuQNzpTE17Afl/CyFc8TDGAF33AB8yUgJ/C+hvwd3uIFPhQr2Ikf6M0AnuEevuQAL2fJVRwh740k3XRZBbEXtz5VyJ7DayzgOB7VVPAcU/l4XqJdOIxZ9Hc4Hw9ws4pgH1bxPXXBng4JQp4nVQTbsIwDHYJH2hEsVRHE/sWsxVoP3Q5XdOChYkKZVcQc3MXRdtBxHU+bEIxgpk3wGLLBNM1/mhDEmejjKw1J/uF01sb/pVS5aTz4EG6nR5usIQq/uZoaI/q/dJURhOGdxC2cqwH/hZjsV3WV5gnO4mFKOFYwwbL8GMZraWpD+9pVrCCseDwZ1RiGsSPJ9Btf8RnhpHHjj5sBt+Jb74/WtPLG57ou0QbqWz0ZBzSqswAAAABJRU5ErkJggg==" />
              </li>
              <li>
                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAi9JREFUSEvN1UnITnEUBvDfx8JMdoREiChThg1JmVI2hqIUiTInZcGGYiE2xpQSxUKxUJJZSCFiY0ghsjKkKGS+R+f7ent77/vafPWd1e3e8z/P/zznOc9t0srR1Mr1tQmAsViAyRiCX7iFO7iAB/VYqNdBPxzGDHzOQk/wDaMxEj2wG1vwvRZQGUDc9Bo6YAOO40+NAmsT4AXm4VF1Ti2AXriXVEzF8wZCGFF0dAbtMBxfKvNrAZzDeIzDy4KmPuiGp3WAAuQ+jmBlPYBJuIFlmTwsu3mHASU0NdfbjB2YjkvNL6s72Iel6FkM7kfR7ibszOQY9sU6XXRKMQRdc8sAHuI15mTCKhzI5wA+2mAecT5iVBnAm4L/mMGKTOidc/iIkO3PBgCHsAjdywCe5bAWVhQKKe7FQaxpMIegcz06lgGcT/4nVN30ZG5z8BuAnZOuUM2pomh0GBF5YzC4DGB7DrYv3laAtC+A92A1PvHPw0K6EbvyTOzBe5zG8jKAgblY24qErTX4npZ0Dc1vvzEzZRncn0hraVFbrUULJYShhcmVRdAQg3yVIuiPuwivmlJ5qBqgS/IZ+7CxgWKaP0fxywkY2x8yb4lqgNk4W9C0GNF+bOXtYouP4WsVYMxpCdalssK3Gprd/hxkc604MCit+HrSEa4aXjUxk27m9tc0xeoOwkMi8SquFJL8UNhx1+Jm84sfzCyEfMNGHqdnhUSD+9JoE7/M/5x17bRW7+Av0jpxGTt6Zt0AAAAASUVORK5CYII=" />
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </>
  );
}
export default Footer;

  const el = document.querySelector('#sec-contents')
  const wrapper = document.querySelector('#contents-wrap')
  const controller = new ScrollMagic.Controller()
  const horizontalMovement = new TimelineMax()

  const controller2 = new ScrollMagic.Controller({
    vertical: false
  })

  horizontalMovement
    .add([
      TweenMax.to(wrapper, 1, { x: `-90%` })
    ])

  new ScrollMagic.Scene({
    triggerElement: el,
    triggerHook: 'onLeave',
    duration: `800%`
  })
    .setPin(el)
    .setTween(horizontalMovement)
    .addTo(controller)
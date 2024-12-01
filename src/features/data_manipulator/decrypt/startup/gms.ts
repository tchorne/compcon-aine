import { encryption } from '@/io/Generators'

const plog = typer => {
  typer
    .type('<br>')
    .type('<br>')
    .type('<br>')
    .type('<br>')
    .type('COMPANION/CONCIERGE UNIT INITIALIZING')
    .break()
    .type(`Establishing encrypted link (${encryption()}) `)
    .pause(100)
    .type('. ')
    .pause(100)
    .type('. ')
    .pause(100)
    .type('. ')
    .pause(200)
    .type('done')
    .break()
    .type('AM-LI in unprivileged domain disabled')
    .break()
    .type('No sensory bridge found // manual input mode enabled')
    .break()
    .type(
      '>//[<span class="accent--text">COMP/CON</span>: <span class="stark-text--text">Welcome, Lancer. Input Command.</span>]'
    )
    .go()
}

export default plog

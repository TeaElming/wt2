// User-land modules.
import { Container, decorate, inject, injectable } from 'inversify'
import 'reflect-metadata'
import IDENTIFIERS from './identifiers.js'

// Services
import { EducationService } from '../services/educationService.js'
import { ManipulationService } from '../services/manipulationService.js'

// Controllers
import { EducationController } from '../controllers/educationController.js'
import { ManipulationController } from '../controllers/manipulationController.js'

// Decorate services
decorate(injectable(), EducationService)
decorate(injectable(), ManipulationService)

// Decorate controllers
decorate(injectable(), EducationController)
decorate(injectable(), ManipulationController)

// Inject dependencies
decorate(inject(IDENTIFIERS.EducationService), ManipulationService, 0)
decorate(inject(IDENTIFIERS.EducationService), EducationController, 0)
decorate(inject(IDENTIFIERS.ManipulationService), ManipulationController, 0)

// Create container
const container = new Container()
container
  .bind(IDENTIFIERS.EducationService)
  .to(EducationService)
  .inSingletonScope()
container
  .bind(IDENTIFIERS.ManipulationService)
  .to(ManipulationService)
  .inSingletonScope()
container
  .bind(IDENTIFIERS.EducationController)
  .to(EducationController)
  .inSingletonScope()
container
  .bind(IDENTIFIERS.ManipulationController)
  .to(ManipulationController)
  .inSingletonScope()

export default container

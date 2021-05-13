import {strings } from '@angular-devkit/core';
import {
  Rule,
  SchematicContext,
  Tree,
  apply,
  chain,
  mergeWith,
  // template,
  url,
  // move,
  applyTemplates,
} from '@angular-devkit/schematics';
import { take } from "rxjs/operators";
import { config } from 'dotenv';
import { CodeGeneration } from './code-generation/code-generation';
import {
  FilesRequest,
  // FileNodeFigma,
  RestApiService
} from '../core';

export default function (options: any): Rule {
  const rule = chain([
    (_tree: Tree, context: SchematicContext) => {
      config();
      context.logger.info('My Start Schematic: ' + JSON.stringify(options));
      new RestApiService().get(FilesRequest, context)
        .pipe(take(1))
        .subscribe((result: any) => {
          const cg = new CodeGeneration();
          cg.generate(result);
        });
    },
    mergeWith(apply(url('./files/components'), [
      applyTemplates({
        dasherize: strings.dasherize,
        INDEX: options.index
      }),
    ])),
  ]);
  
  return rule;
}

import { Component, Input, OnInit } from '@angular/core';

import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { Router, ActivatedRoute } from '@angular/router';

import { BaseComponent } from '@campus-cloud/base/base.component';
import { CPI18nService } from '@campus-cloud/shared/services';
import { FormState } from '../form-state.interface';
import { WebFormService } from '../web-form.service';

import { addResponse, removeResponse } from '../web-form.actions';
import { setError } from '../web-form-error.actions';

@Component({
  selector: 'app-form-block',
  templateUrl: './form-block.component.html',
  styleUrls: ['./form-block.component.scss']
})
export class FormBlockComponent extends BaseComponent implements OnInit {
  formBlock: FormGroup;
  formState: FormState;
  file: any;

  formId: string;
  formBlockId: number;
  nextFormBlockId: number;

  showSubmitConfirmation: boolean = false;

  @Input() webFormData: any;
  @Input() currentFormBlock: any;

  constructor(
    public cpI18n: CPI18nService,
    private router: Router,
    private store: Store<{ webForm: FormState; webFormError: string }>,
    private webFormService: WebFormService,
    private route: ActivatedRoute
  ) {
    super();
    this.store.pipe(select('webForm')).subscribe((formState: FormState) => {
      this.formState = formState;
    });
  }

  clearResponse(formBlockId: number) {
    // Remove the previous answer if user visits the Form Block
    this.store.dispatch(
      removeResponse({
        formBlockId: formBlockId
      })
    );
  }

  setError() {
    this.store.dispatch(
      setError({
        message: this.cpI18n.translate('web_form_action_not_successful')
      })
    );
  }

  clearError() {
    this.store.dispatch(
      setError({
        message: null
      })
    );
  }

  closeConfirmationModal() {
    this.showSubmitConfirmation = false;
    this.clearResponse(this.formBlockId);
    this.clearResponse(this.nextFormBlockId);
  }

  // Intercept and update the responseData (uncontrolled)
  onCheckBoxChange(e: any) {
    const { value, checked } = e.target;
    const { answer } = this.formBlock.value;
    let values = answer === '' ? [] : answer.split(',');
    if (checked) {
      values.push(value);
    } else {
      const index = values.indexOf(value);
      if (index > -1) {
        values.splice(index, 1);
      }
    }
    this.formBlock.patchValue({
      answer: values.join(',')
    });
  }

  onFileAdd(e: any) {
    this.file = e.target.files[0];
  }

  submit() {
    // Close the modal
    this.showSubmitConfirmation = false;

    const { formId, formBlockId } = this;
    const { formResponseId, externalUserId, formBlockResponses } = this.formState;
    this.webFormService.submit(formResponseId, externalUserId, formBlockResponses).subscribe(
      () => {
        this.router.navigate([`cb/web-form/${formId}/${this.nextFormBlockId}`]);
      },
      () => {
        this.setError();
        this.clearResponse(formBlockId);
        this.clearResponse(this.nextFormBlockId);
      }
    );
  }

  processNextFormBlock() {
    const { formId, formBlockId } = this;

    // Get the Form answer
    const { answer } = this.formBlock.value;

    let responseFormBlockContentIds: string = '';
    let responseFormBlockContentIdsArray: string[] = [];
    let responseData: string = '';

    // Process the correct values
    if (this.currentFormBlock.block_type === 1 || this.currentFormBlock.block_type === 2) {
      responseFormBlockContentIds = answer;
      responseFormBlockContentIdsArray = answer === '' ? [] : answer.split(',');
    } else {
      responseData = answer;
    }

    // Make a GET call to Form Block to get the next id.
    this.webFormService
      .getNextFormBlock(formId, formBlockId, responseFormBlockContentIds, responseData)
      .subscribe(
        (response: any) => {
          this.nextFormBlockId = response.id;

          // Update the state with the block response for submission later
          this.store.dispatch(
            addResponse({
              formBlockId,
              responseFormBlockContentIds: responseFormBlockContentIdsArray,
              responseData
            })
          );

          // Check if the next block is a terminal block
          const nextFormBlock = this.webFormData.form_block_list.find((formBlock: any) => {
            return formBlock.id === this.nextFormBlockId;
          });

          // If the next block is terminal. Submit the form!
          if (nextFormBlock.is_terminal) {
            // Add the block to the submission
            this.store.dispatch(
              addResponse({
                formBlockId: this.nextFormBlockId,
                responseFormBlockContentIds: [],
                responseData: ''
              })
            );

            // Check if the confirmation is required
            if (this.webFormData.is_confirmation_required) {
              this.showSubmitConfirmation = true;
            } else {
              this.submit();
            }
          } else {
            this.router.navigate([`cb/web-form/${formId}/${this.nextFormBlockId}`]);
          }
        },
        () => {
          this.setError();
        }
      );
  }

  next() {
    // Upload the file
    if (this.currentFormBlock.block_type === 5 && this.file) {
      const { formResponseId } = this.formState;
      this.webFormService.uploadImage(7, formResponseId, this.file).subscribe(
        (response: any) => {
          this.formBlock.patchValue({
            answer: response.image_url
          });

          this.processNextFormBlock();
        },
        () => {
          this.setError();
        }
      );
    } else {
      this.processNextFormBlock();
    }
  }

  ngOnInit() {
    // Grab the URL params
    this.route.params.subscribe((params) => {
      const { formId, formBlockId } = params;
      this.formId = formId;
      this.formBlockId = parseInt(formBlockId, 10);

      // Check if an email has been entered
      if (this.formState.externalUserId === '') {
        this.router.navigate([`cb/web-form/${this.formId}/start`]);
      }

      let validators = [];
      // Set up the validator for the block_type
      switch (this.currentFormBlock.block_type) {
        case 4:
          validators = [Validators.pattern(/^-{0,1}\d*\.{0,1}\d+$/)];
          break;
        case 6:
          validators = [Validators.pattern(/^-{0,1}\d+$/)];
          break;
        case 1:
        case 2:
        case 3:
        case 5:
        default:
          validators = [];
      }

      this.formBlock = new FormGroup({
        answer: new FormControl('', validators)
      });

      // Clear everything whenever the url params change
      this.clearError();
      this.clearResponse(parseInt(formBlockId, 10));
    });
  }

  get answer() {
    return this.formBlock.get('answer');
  }
}

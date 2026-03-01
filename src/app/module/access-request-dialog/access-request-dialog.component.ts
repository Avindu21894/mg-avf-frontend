import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-access-request-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './access-request-dialog.component.html',
  styleUrls: ['./access-request-dialog.component.css']
})
export class AccessRequestDialogComponent {
  fullName: string = '';
  institution: string = '';
  email: string = '';
  intendedUse: string = '';
  otherUse: string = '';
  paperSource: string = '';
  additionalDetails: string = '';

  intendedUses = [
    'Academic research',
    'Journalism verification',
    'Law-enforcement forensics',
    'Other'
  ];

  constructor(
    public dialogRef: MatDialogRef<AccessRequestDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    const formData = {
      fullName: this.fullName,
      institution: this.institution,
      email: this.email,
      intendedUse: this.intendedUse === 'Other' ? `Other: ${this.otherUse}` : this.intendedUse,
      paperSource: this.paperSource,
      additionalDetails: this.additionalDetails
    };
    console.log('Form submitted:', formData);
    this.dialogRef.close(formData);
  }

  get showOtherField(): boolean {
    return this.intendedUse === 'Other';
  }
}
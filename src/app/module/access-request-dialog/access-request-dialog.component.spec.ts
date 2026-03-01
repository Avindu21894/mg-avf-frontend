import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessRequestDialogComponent } from './access-request-dialog.component';

describe('AccessRequestDialogComponent', () => {
  let component: AccessRequestDialogComponent;
  let fixture: ComponentFixture<AccessRequestDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccessRequestDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccessRequestDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

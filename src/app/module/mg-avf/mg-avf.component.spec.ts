import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MgAvfComponent } from './mg-avf.component';

describe('MgAvfComponent', () => {
  let component: MgAvfComponent;
  let fixture: ComponentFixture<MgAvfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MgAvfComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MgAvfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

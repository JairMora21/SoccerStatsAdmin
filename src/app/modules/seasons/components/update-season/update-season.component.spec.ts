import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateSeasonComponent } from './update-season.component';

describe('UpdateSeasonComponent', () => {
  let component: UpdateSeasonComponent;
  let fixture: ComponentFixture<UpdateSeasonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateSeasonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateSeasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteSeasonComponent } from './delete-season.component';

describe('DeleteSeasonComponent', () => {
  let component: DeleteSeasonComponent;
  let fixture: ComponentFixture<DeleteSeasonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteSeasonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteSeasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

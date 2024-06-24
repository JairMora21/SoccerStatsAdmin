import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryMatchComponent } from './summary-match.component';

describe('SummaryMatchComponent', () => {
  let component: SummaryMatchComponent;
  let fixture: ComponentFixture<SummaryMatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SummaryMatchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SummaryMatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
